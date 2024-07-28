let _dataTable = undefined;
$(document).ready(function () {

    getLocationList();

    $('#submit_button').on('click', function () {
        let locationName = $('#LocationName').val();
        
        let locationId = $('#LocationId').val();
        if (locationId == '') {
            locationId = 0;
        }

        let dataObj = {
            id: locationId,
            locationName: locationName,
           
        };

        let operationType = $('#operation_type').val();

        if (operationType == 'create') {
            $.ajax({
                url: '/api/Locations/CreateLocation',
                type: 'POST',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#LocationName').val('');
                    
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getLocationList();
                }
                if (responseObject.statusCode == 400 || responseObject.statusCode == 409) {
                    for (let error in responseObject.errors) {
                        $(`#${error}`).empty();
                        $(`#${error}`).append(responseObject.errors[error]);
                    }
                    showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
                }
            });


        }
        else {

            $.ajax({
                url: '/api/Locations/UpdateLocation',
                type: 'PUT',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#LocationName').val('');
                  

                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getLocationList();
                    $('#operation_type').val('create');
                    $('#submit_button').html('create');
                }
                if (responseObject.statusCode == 400) {
                    for (let error in responseObject.errors) {
                        $(`#${error}`).empty();
                        $(`#${error}`).append(responseObject.errors[error]);
                    }
                    showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
                }
                if (responseObject.statusCode == 500) {
                    showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
                }
            });

        }


    });

});

function getLocationList() {

    var count = 0;

    if (_dataTable != undefined) {
        _dataTable.destroy();
    }

    _dataTable = $('#location_list_table').DataTable({
        ajax: {
            url: '/api/Locations/GetLocations',
            dataSrc: 'data'
        },
        columns: [
            {
                data: '',
                render: (data, type) => {
                    count++;
                    return count;
                }
            },
            { data: 'locationName' },
            {
                data: 'isActive',
                render: (data, type) => {
                    if (data.toString() == 'true') {
                        return 'active';
                    }
                    return data;
                }
            },
            {
                data: 'id',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-primary btn-sm" onclick="onEditClicked(${data})">edit</button> <button type="button" class="btn btn-danger btn-sm" onclick="onRemoveClicked(${data})">delete</button>`;
                }
            },

        ]
    });
}


function onEditClicked(locationId) {
    $('#edit_modal').modal('show');
    $('#LocationId').val(locationId);
}

function onEditConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _locationId = $('#LocationId').val();
    $('#operation_type').val('edit');
    $('#submit_button').html('edit');
    $('#edit_modal').modal('hide');
    $.ajax({
        url: '/api/Locations/GetLocationById?id=' + _locationId,
        type: 'GET',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            $('#LocationName').val(responseObject.data.locationName);
          
        }
        if (responseObject.statusCode == 404) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}

function onRemoveClicked(locationId) {
    $('#remove_modal').modal('show');
    $('#LocationId').val(locationId);
}

function onRemoveConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _locationId = $('#LocationId').val();
    $('#remove_modal').modal('hide');
    $.ajax({
        url: '/api/Locations/RemoveLocation?id=' + _locationId,
        type: 'DELETE',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            getLocationList();
            $('#LocationName').val('');
          
            $('#operation_type').val('create');
            $('#submit_button').html('create');

            showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
        }
        if (responseObject.statusCode == 404 || responseObject.statusCode == 500) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}