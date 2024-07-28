let employeeTypes = [];
let _dataTable = undefined;
$(document).ready(function () {

    loadInitialData();
    getGradeList();

    $('#submit_button').on('click', function () {
        let gradeId = $('#GradeId').val();
        let gradeName = $('#GradeName').val();
        let description = $('#Description').val();
        let employeeTypeId = $('#EmployeeTypeId').val();

        if (gradeId == '') {
            gradeId = 0;
        }


        let dataObj = {
            id: gradeId,
            gradeName: gradeName,
            description: description,
            employeeTypeId: employeeTypeId,
        };

        let operationType = $('#operation_type').val();

        if (operationType == 'create') {


            $.ajax({
                url: '/api/Grades/CreateGrade',
                type: 'POST',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#GradeName').val('');
                    $('#Description').val('');
                    $('#EmployeeTypeId').empty();
                    $('#EmployeeTypeId').append('<option value="0">select one</option>');
                    $.each(employeeTypes, function (key, item) {
                        $('#EmployeeTypeId').append(`<option value=${item.id}>${item.employeeTypeName}</option>`);
                    });
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getGradeList();
                }
                if (responseObject.statusCode == 400 || responseObject.statusCode == 409) {
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
        else {

            $.ajax({
                url: '/api/Grades/UpdateGrade',
                type: 'PUT',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#GradeName').val('');
                    $('#Description').val('');
                    $('#EmployeeTypeId').empty();
                    $('#EmployeeTypeId').append('<option value="0">select one</option>');
                    $.each(employeeTypes, function (key, item) {
                        if (item.id != 3 && item.id != 4) {
                            $('#EmployeeTypeId').append(`<option value=${item.id}>${item.employeeTypeName}</option>`);
                        }
                       
                    });
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getGradeList();
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


function loadInitialData() {
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
                if (item.id != 3 && item.id!=4) {
                    $('#EmployeeTypeId').append(`<option value=${item.id}>${item.employeeTypeName}</option>`);
                }
                
            });
        },
        error: function (responseObject) {
        }
    });

}

function getGradeList() {

    var count = 0;

    if (_dataTable != undefined) {
        _dataTable.destroy();
    }

    _dataTable = $('#grade_list_table').DataTable({
        ajax: {
            url: '/api/Grades/GetGrades',
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
            { data: 'gradeName' },
            { data: 'employeeTypeName' },
            {
                data: 'id',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-primary btn-sm" onclick="onEditClicked(${data})">edit</button> <button type="button" class="btn btn-danger btn-sm" onclick="onRemoveClicked(${data})">delete</button>`;
                }
            },

        ]
    });

    //$.ajax({
    //    url: '/api/Grades/GetGrades',
    //    type: 'Get',
    //    async: false,
    //    dataType: 'json',
    //    success: function (responseObject) {
    //        $('#grade_list_table tbody').empty();
    //        let count = 1;
    //        $.each(responseObject.data, function (key, item) {
    //            $('#grade_list_table tbody').append(`<tr>
    //                        <td>${count}</td>
    //                        <td>${item.gradeName}</td>
    //                        <td>${item.employeeTypeName}</td>
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


function onEditClicked(gradeId) {
    $('#edit_modal').modal('show');
    $('#GradeId').val(gradeId);
}

function onEditConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _gradeId = $('#GradeId').val();
    $('#operation_type').val('edit');
    $('#submit_button').html('edit');
    $('#edit_modal').modal('hide');
    $.ajax({
        url: '/api/Grades/GetGradeById?id=' + _gradeId,
        type: 'GET',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            $('#GradeName').val(responseObject.data.gradeName);
            $('#Description').val(responseObject.data.description);

            $('#EmployeeTypeId').empty();
            $('#EmployeeTypeId').append('<option value="0">select one</option>');
            $.each(employeeTypes, function (key, item) {
                if (item.id != 3 && item.id != 4) {
                    if (item.id == responseObject.data.employeeTypeId) {
                        $('#EmployeeTypeId').append(`<option value=${item.id} selected>${item.employeeTypeName}</option>`);
                    }
                    else {
                        $('#EmployeeTypeId').append(`<option value=${item.id}>${item.employeeTypeName}</option>`);
                    }
                }
               

            });

        }
        if (responseObject.statusCode == 404) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}



function onRemoveClicked(gradeId) {
    $('#remove_modal').modal('show');
    $('#GradeId').val(gradeId);
}
function onRemoveConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _gradeId = $('#GradeId').val();
    $('#remove_modal').modal('hide');
    $.ajax({
        url: '/api/Grades/RemoveGrade?id=' + _gradeId,
        type: 'DELETE',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            $('#GradeName').val('');
            $('#Description').val('');
            $('#EmployeeTypeId').empty();
            $('#EmployeeTypeId').append('<option value="0">select one</option>');
            $.each(employeeTypes, function (key, item) {
                $('#EmployeeTypeId').append(`<option value=${item.id}>${item.employeeTypeName}</option>`);
            });
            showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
            getGradeList();
            $('#operation_type').val('create');
            $('#submit_button').html('create');
        }
        if (responseObject.statusCode == 404 || responseObject.statusCode == 500) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}