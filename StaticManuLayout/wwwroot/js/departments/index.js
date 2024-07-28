let _dataTable = undefined;
$(document).ready(function () {

    getDepartmentList();

    $('#submit_button').on('click', function () {
        let departmentName = $('#DepartmentName').val();
        let description = $('#Description').val();
        let departmentId = $('#DepartmentId').val();
        if (departmentId == '') {
            departmentId = 0;
        }

        let dataObj = {
            id: departmentId,
            departmentName: departmentName,
            description: description,
        };

        let operationType = $('#operation_type').val();

        if (operationType == 'create') {


            $.ajax({
                url: '/api/Departments/CreateDepartment',
                type: 'POST',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#DepartmentName').val('');
                    $('#Description').val('');
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getDepartmentList();
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
                url: '/api/Departments/UpdateDepartment',
                type: 'PUT',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#DepartmentName').val('');
                    $('#Description').val('');
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getDepartmentList();
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

function getDepartmentList() {
    var count = 0;

    if (_dataTable != undefined) {
        _dataTable.destroy();
    }
    _dataTable = $('#department_list_table').DataTable({
        ajax:{
            url : '/api/Departments/GetDepartments',
            dataSrc : 'data'
        },
        columns: [
            {
                data: '',
                render: (data, type) => {
                    count++;
                    return count;
                }
            },
            { data: 'departmentName' },
            {
                data: 'isActive',
                render: (data, type) => {
                    if (data.toString()=='true') {
                        return 'active';
                    }
                    return data;
                }
            },
            {
                data: 'id',
                render: (data, type,row) => {
                    return `<button type="button" class="btn btn-primary btn-sm" onclick="onEditClicked(${data})">edit</button> <button type="button" class="btn btn-danger btn-sm" onclick="onRemoveClicked(${data})">delete</button>`;
                }
            },
            
        ]
    });

}

function onEditClicked(departmentId) {
    $('#edit_modal').modal('show');
    $('#DepartmentId').val(departmentId);
}

function onEditConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _departmentId = $('#DepartmentId').val();
    $('#operation_type').val('edit');
    $('#submit_button').html('edit');
    $('#edit_modal').modal('hide');
    $.ajax({
        url: '/api/Departments/GetDepartmentById?id=' + _departmentId,
        type: 'GET',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            $('#DepartmentName').val(responseObject.data.departmentName);
            $('#Description').val(responseObject.data.description);
        }
        if (responseObject.statusCode == 404) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}

function onRemoveClicked(departmentId) {
    $('#remove_modal').modal('show');
    $('#DepartmentId').val(departmentId);
}

function onRemoveConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _departmentId = $('#DepartmentId').val();
    $('#remove_modal').modal('hide');
    $.ajax({
        url: '/api/Departments/RemoveDepartment?id=' + _departmentId,
        type: 'DELETE',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            getDepartmentList();
            showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
        }
        if (responseObject.statusCode == 404 || responseObject.statusCode == 500) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}