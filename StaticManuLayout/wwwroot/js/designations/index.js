let _dataTable = undefined;
$(document).ready(function () {

    getDesignationList();
    initialLoads();



    $('#submit_button').on('click', function () {
        let employeeTypeId = parseInt($('#EmployeeTypeId').val());
        let designationName = $('#DesignationName').val();
        let description = $('#Description').val();
        let designationId = $('#DesignationId').val();

        if (designationId=='') {
            designationId=0;
        }
        console.log(employeeTypeId);
        let dataObj = {
            id: designationId,
            designationName: designationName,
            description: description,
            employeeTypeId: employeeTypeId
        };

        let operationType = $('#operation_type').val();

        if (operationType == 'create') {
            $.ajax({
                url: '/api/Designations/CreateDesignation',
                type: 'POST',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#DesignationName').val('');
                    $('#Description').val('');
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getDesignationList();
                    initialLoads();
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
                url: '/api/Designations/UpdateDesignation',
                type: 'PUT',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#DesignationName').val('');
                    $('#Description').val('');

                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getDesignationList();
                    initialLoads();
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

function getDesignationList() {

    var count = 0;

    if (_dataTable != undefined) {
        _dataTable.destroy();
    }

    _dataTable = new DataTable('#designation_list_table', {
        initComplete: function () {
            this.api()
                .columns()
                .every(function (columnIndex) {
                    let column = this;
                    if (columnIndex == 2) {
                        // Create select element
                        let select = document.createElement('select');
                        select.style.cssText = 'width:100%;height:30px;border: 1px solid #dee2e6;';
                        select.add(new Option(''));
                        column.footer().replaceChildren(select);

                        // Apply listener for user change in value
                        select.addEventListener('change', function () {
                            column
                                .search(select.value, { exact: true })
                                .draw();
                        });

                        // Add list of options
                        column
                            .data()
                            .unique()
                            .sort()
                            .each(function (d, j) {
                                select.add(new Option(d));
                            });
                    }
                    if (columnIndex == 0) {
                        column.footer().replaceChildren(document.createElement('span').innerHTML = 'Filter');
                    }

                });
        },
        ajax: {
            url: '/api/Designations/GetDesignations',
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
            { data: 'designationName' },
            { data: 'employeeTypeName' },
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

    //$.ajax({
    //    url: '/api/Designations/GetDesignations',
    //    type: 'Get',
    //    async: false,
    //    dataType: 'json',
    //    success: function (responseObject) {
    //        $('#designation_list_table tbody').empty();
    //        let count = 1;
    //        $.each(responseObject.data, function (key, item) {
    //            $('#designation_list_table tbody').append(`<tr>
    //                        <td>${count}</td>
    //                        <td>${item.designationName}</td>
    //                        <td>${item.isActive == true ? 'active' : 'inactive'}</td>
    //                        <td>
    //                            <button type="button" class="btn btn-primary btn-sm" onclick="onEditClicked(${item.id})">edit</button>
    //                            <button type="button" class="btn btn-danger btn-sm" onclick="onRemoveClicked(${item.id})">delete</button>
    //                        </td>
    //                    </tr>`);
    //            count++;
    //        });
    //    },
    //    error: function (responseObject) {
    //    }
    //});
}

function onEditClicked(designationId) {
    $('#edit_modal').modal('show');
    $('#DesignationId').val(designationId);
}

function onEditConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _designationId = $('#DesignationId').val();
    $('#operation_type').val('edit');
    $('#submit_button').html('edit');
    $('#edit_modal').modal('hide');
    $.ajax({
        url: '/api/Designations/GetDesignationById?id=' + _designationId,
        type: 'GET',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            $('#EmployeeTypeId').val(responseObject.data.employeeTypeId);
            $('#DesignationName').val(responseObject.data.designationName);
            $('#Description').val(responseObject.data.description);
        }
        if (responseObject.statusCode == 404) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}

function onRemoveClicked(designationId) {
    $('#remove_modal').modal('show');
    $('#DesignationId').val(designationId);
}

function onRemoveConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _designationId = $('#DesignationId').val();
    $('#remove_modal').modal('hide');
    $.ajax({
        url: '/api/Designations/RemoveDesignation?id=' + _designationId,
        type: 'DELETE',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            getDesignationList();
            showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
        }
        if (responseObject.statusCode == 404 || responseObject.statusCode == 500) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}

function initialLoads() {

    $.ajax({
        url: '/api/Employees/GetEmployeeTypes',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            employeeTypes = responseObject.data;
            $('#EmployeeTypeId').empty();
            $('#EmployeeTypeId').append('<option value="0">select one</option>');
            $.each(employeeTypes, function (key, item) {
                if (item.id != 3 && item.id != 4) {
                    $('#EmployeeTypeId').append(`<option value=${item.id}>${item.employeeTypeName}</option>`);
                }
                
            });
        },
        error: function (responseObject) {
        }
    });
}