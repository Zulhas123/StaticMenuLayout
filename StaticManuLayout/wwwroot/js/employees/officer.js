let genders = [];
let maritals = [];
let religions = [];
let employeeTypes = [];
let grades = [];
let departments = [];
let designations = [];
let locations = [];
let activeStatus = [];
let _dataTable = undefined;
$(document).ready(function () {

    loadInitialData();
    getEmployeeList();
    {
        var navListItems = $('div.setup-panel div a'),
            allWells = $('.setup-content'),
            allNextBtn = $('.nextBtn');

        allWells.hide();

        navListItems.click(function (e) {
            e.preventDefault();
            var $target = $($(this).attr('href')),
                $item = $(this);

            if (!$item.hasClass('disabled')) {
                navListItems.removeClass('btn-success').addClass('btn-default');
                $item.addClass('btn-success');
                allWells.hide();
                $target.show();
                $target.find('input:eq(0)').focus();
            }
        });

        allNextBtn.click(function () {
            var curStep = $(this).closest(".setup-content"),
                curStepBtn = curStep.attr("id"),
                nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
                curInputs = curStep.find("input[type='text'],input[type='url']"),
                isValid = true;

            $(".form-group").removeClass("has-error");
            for (var i = 0; i < curInputs.length; i++) {
                if (!curInputs[i].validity.valid) {
                    isValid = false;
                    $(curInputs[i]).closest(".form-group").addClass("has-error");
                }
            }

            if (isValid) nextStepWizard.removeAttr('disabled').trigger('click');
        });

        $('div.setup-panel div a.btn-success').trigger('click');
    }

    $('#submit_button').on('click', function () {
        let employeeId = $('#EmployeeId').val();
        let jobCode = $('#JobCode').val();
        let employeeName = $('#EmployeeName').val();
        let fatherName = $('#FatherName').val();
        let motherName = $('#MotherName').val();
        let dateOfBirth = $('#DateOfBirth').val();
        let genderId = $('#GenderId').val();
        let maritalId = $('#MaritalId').val();
        let religionId = $('#ReligionId').val();

        let employeeTypeId = $('#EmployeeTypeId').val();
        let gradeId = $('#GradeId').val();
        let departmentId = $('#DepartmentId').val();
        let designationId = $('#DesignationId').val();
        let locationId = $('#LocationId').val();


        let joiningDate = $('#JoiningDate').val();
        let journalCode = $('#JournalCode').val();
        let tinNo = $('#TinNo').val();
        let mobileNumber = $('#MobileNumber').val();
        let presentAddress = $('#PresentAddress').val();

        let permanentAddress = $('#PermanentAddress').val();
        let qualifications = $('#Qualifications').val();
        let identityMarks = $('#IdentityMarks').val();
        let remarks = $('#Remarks').val();
        let taxStatus = $('#TaxStatus').is(":checked");
        let activeStatus = $('#ActiveStatus').val();

        if (employeeId=='') {
            employeeId = 0;
        }

        let dataObj = {
            id: employeeId,
            jobCode: jobCode,
            employeeName: employeeName,
            fatherName: fatherName,
            motherName: motherName,

            dateOfBirth: dateOfBirth,
            genderId: genderId,
            maritalId: maritalId,
            religionId: religionId,
            employeeTypeId: employeeTypeId,

            gradeId: gradeId,
            departmentId: departmentId,
            designationId: designationId,
            locationId: locationId,
            joiningDate: joiningDate,

            journalCode: journalCode,
            tinNo: tinNo,
            mobileNumber: mobileNumber,
            presentAddress: presentAddress,
            permanentAddress: permanentAddress,

            qualifications: qualifications,
            identityMarks: identityMarks,
            remarks: remarks,
            taxStatus: taxStatus,
            activeStatus: activeStatus
        };

        let operationType = $('#operation_type').val();

        if (operationType == 'create') {


            $.ajax({
                url: '/api/Employees/CreateEmployee',
                type: 'POST',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    resetInputs();
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getEmployeeList();
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
                url: '/api/Employees/UpdateEmployee',
                type: 'PUT',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    resetInputs();
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getEmployeeList();
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
                if (responseObject.statusCode == 500 || responseObject.statusCode == 404) {
                    showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
                }
            });

        }


    });




});


function resetInputs() {
    $('#JobCode').val('');
    $('#EmployeeName').val('');
    $('#FatherName').val('');
    $('#MotherName').val('');
    $('#DateOfBirth').val('');

    $('#JoiningDate').val('');
    $('#JournalCode').val('');
    $('#TinNo').val('');
    $('#MobileNumber').val('');
    $('#PresentAddress').val('');

    $('#PermanentAddress').val('');
    $('#Qualifications').val('');
    $('#IdentityMarks').val('');
    $('#Remarks').val('');
    $('#TaxStatus').prop('checked', false);

    loadInitialData();
}


function loadInitialData() {
    $.ajax({
        url: '/api/Others/GetGenders',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            genders = responseObject.data;
            $('#GenderId').empty();
            $('#GenderId').append('<option value="0">select one</option>');
            $.each(genders, function (key, item) {
                $('#GenderId').append(`<option value=${item.id}>${item.genderName}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });

    $.ajax({
        url: '/api/Others/GetMaritals',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            maritals = responseObject.data;
            $('#MaritalId').empty();
            $('#MaritalId').append('<option value="0">select one</option>');
            $.each(maritals, function (key, item) {
                $('#MaritalId').append(`<option value=${item.id}>${item.maritalName}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });

    $.ajax({
        url: '/api/Others/GetReligions',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            religions = responseObject.data;
            $('#ReligionId').empty();
            $('#ReligionId').append('<option value="0">select one</option>');
            $.each(religions, function (key, item) {
                $('#ReligionId').append(`<option value=${item.id}>${item.religionName}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });
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
                if (item.id == 1 || item.id == 3) {
                    $('#EmployeeTypeId').append(`<option value=${item.id}>${item.employeeTypeName}</option>`);
                }
                
            });
        },
        error: function (responseObject) {
        }
    });

    $.ajax({
        url: '/api/Grades/GetGradesByEmployeeType?employeeTypeId=1',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            grades = responseObject.data;
            $('#GradeId').empty();
            $('#GradeId').append('<option value="0">select one</option>');
            $.each(grades, function (key, item) {
                $('#GradeId').append(`<option value=${item.id}>${item.gradeName}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });

    $.ajax({
        url: '/api/Departments/GetDepartments',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            departments = responseObject.data;
            $('#DepartmentId').empty();
            $('#DepartmentId').append('<option value="0">select one</option>');
            $.each(departments, function (key, item) {
                $('#DepartmentId').append(`<option value=${item.id}>${item.departmentName}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });

    $.ajax({
        url: '/api/Designations/GetDesignationsByEmployeeType?employeeTypeId=1',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            designations = responseObject.data;
            $('#DesignationId').empty();
            $('#DesignationId').append('<option value="0">select one</option>');
            $.each(designations, function (key, item) {
                $('#DesignationId').append(`<option value=${item.id}>${item.designationName}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });

    $.ajax({
        url: '/api/Locations/GetLocations',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            locations = responseObject.data;
            $('#LocationId').empty();
            $('#LocationId').append('<option value="0">select one</option>');
            $.each(locations, function (key, item) {
                $('#LocationId').append(`<option value=${item.id}>${item.locationName}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });

    $.ajax({
        url: '/api/Others/GetActiveStatus',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            activeStatus = responseObject.data;
            $('#ActiveStatus').empty();
            $.each(activeStatus, function (key, item) {
                $('#ActiveStatus').append(`<option value=${item.id}>${item.activeStatusName}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });

}

function getEmployeeList() {
    var count = 0;

    if (_dataTable != undefined) {
        _dataTable.destroy();
    }


    _dataTable = $('#employee_list_table').DataTable({
        ajax: {
            url: '/api/Employees/GetEmployees?employeeTypeId=1',
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
            { data: 'jobCode' },
            { data: 'employeeName' },
            { data: 'designationName' },
            { data: 'departmentName' },
            {
                data: 'id',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-primary btn-sm" onclick="onEditClicked(${data})">edit</button> <button type="button" class="btn btn-info btn-sm" onclick="onViewClicked(${data})">view</button>`;
                }
            },

        ]
    });

}

function getBankList() {
    var count = 0;

    if (_dataTable != undefined) {
        _dataTable.destroy();
    }


    _dataTable = $('#employee_list_table').DataTable({
        ajax: {
            url: '/api/Employees/GetEmployees?employeeTypeId=1',
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
            { data: 'jobCode' },
            { data: 'employeeName' },
            { data: 'designationName' },
            { data: 'departmentName' },
            {
                data: 'id',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-primary btn-sm" onclick="onEditClicked(${item.id})">edit</button> <button type="button" class="btn btn-info btn-sm" onclick="onViewClicked(${item.id})">view</button>`;
                }
            },

        ]
    });

}

function onViewClicked(employeeId) {
    $.ajax({
        url: '/api/Employees/GetEmployeeForView?id=' + employeeId,
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            dataObject = responseObject.data;
            $('#view_employee_name').html(dataObject.employeeName);
            $('#view_father_name').html(dataObject.fatherName);
            $('#view_mother_name').html(dataObject.motherName);
            $('#view_date_of_birth').html(dataObject.dateOfBirth);
            $('#view_modal').modal('show');
        },
        error: function (responseObject) {
        }
    });
}

function onEditClicked(employeeId) {
    $('#edit_modal').modal('show');
    $('#EmployeeId').val(employeeId);
}

function onEditConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _employeeId = $('#EmployeeId').val();
    $('#operation_type').val('edit');
    $('#submit_button').html('edit');
    $('#edit_modal').modal('hide');
    $.ajax({
        url: '/api/Employees/GetEmployeeById?id=' + _employeeId,
        type: 'GET',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {

            $('#JobCode').val(responseObject.data.jobCode);
            $('#EmployeeName').val(responseObject.data.employeeName);
            $('#FatherName').val(responseObject.data.fatherName);
            $('#MotherName').val(responseObject.data.motherName);
            $('#DateOfBirth').val(responseObject.data.dateOfBirth);

            $('#JoiningDate').val(responseObject.data.joiningDate);
            $('#JournalCode').val(responseObject.data.journalCode);
            $('#TinNo').val(responseObject.data.tinNo);
            $('#MobileNumber').val(responseObject.data.mobileNumber);
            $('#PresentAddress').val(responseObject.data.presentAddress);

            $('#PermanentAddress').val(responseObject.data.permanentAddress);
            $('#Qualifications').val(responseObject.data.qualifications);
            $('#IdentityMarks').val(responseObject.data.identityMarks);
            $('#Remarks').val(responseObject.data.remarks);
            $('#TaxStatus').prop('checked', responseObject.data.taxStatus);

            $('#GenderId').empty();
            $('#GenderId').append('<option value="0">select one</option>');
            $.each(genders, function (key, item) {
                if (item.id == responseObject.data.genderId) {
                    $('#GenderId').append(`<option value=${item.id} selected>${item.genderName}</option>`);
                }
                else {
                    $('#GenderId').append(`<option value=${item.id}>${item.genderName}</option>`);
                }

            });

            $('#MaritalId').empty();
            $('#MaritalId').append('<option value="0">select one</option>');
            $.each(maritals, function (key, item) {
                if (item.id == responseObject.data.maritalId) {
                    $('#MaritalId').append(`<option value=${item.id} selected>${item.maritalName}</option>`);
                }
                else {
                    $('#MaritalId').append(`<option value=${item.id}>${item.maritalName}</option>`);
                }

            });

            $('#ReligionId').empty();
            $('#ReligionId').append('<option value="0">select one</option>');
            $.each(religions, function (key, item) {
                if (item.id == responseObject.data.religionId) {
                    $('#ReligionId').append(`<option value=${item.id} selected>${item.religionName}</option>`);
                }
                else {
                    $('#ReligionId').append(`<option value=${item.id}>${item.religionName}</option>`);
                }

            });

            $('#EmployeeTypeId').empty();
            $('#EmployeeTypeId').append('<option value="0">select one</option>');
            $.each(employeeTypes, function (key, item) {
                if (item.id == responseObject.data.employeeTypeId) {
                    $('#EmployeeTypeId').append(`<option value=${item.id} selected>${item.employeeTypeName}</option>`);
                }
                else {
                    $('#EmployeeTypeId').append(`<option value=${item.id}>${item.employeeTypeName}</option>`);
                }

            });

            $('#GradeId').empty();
            $('#GradeId').append('<option value="0">select one</option>');
            $.each(grades, function (key, item) {
                if (item.id == responseObject.data.gradeId) {
                    $('#GradeId').append(`<option value=${item.id} selected>${item.gradeName}</option>`);
                }
                else {
                    $('#GradeId').append(`<option value=${item.id}>${item.gradeName}</option>`);
                }

            });

            $('#DepartmentId').empty();
            $('#DepartmentId').append('<option value="0">select one</option>');
            $.each(departments, function (key, item) {
                if (item.id == responseObject.data.departmentId) {
                    $('#DepartmentId').append(`<option value=${item.id} selected>${item.departmentName}</option>`);
                }
                else {
                    $('#DepartmentId').append(`<option value=${item.id}>${item.departmentName}</option>`);
                }

            });

            $('#DesignationId').empty();
            $('#DesignationId').append('<option value="0">select one</option>');
            $.each(designations, function (key, item) {
                if (item.id == responseObject.data.designationId) {
                    $('#DesignationId').append(`<option value=${item.id} selected>${item.designationName}</option>`);
                }
                else {
                    $('#DesignationId').append(`<option value=${item.id}>${item.designationName}</option>`);
                }

            });

            $('#LocationId').empty();
            $('#LocationId').append('<option value="0">select one</option>');
            $.each(locations, function (key, item) {
                if (item.id == responseObject.data.locationId) {
                    $('#LocationId').append(`<option value=${item.id} selected>${item.locationName}</option>`);
                }
                else {
                    $('#LocationId').append(`<option value=${item.id}>${item.locationName}</option>`);
                }

            });

            $('#ActiveStatus').empty();
            $.each(activeStatus, function (key, item) {
                if (item.id == responseObject.data.activeStatus) {
                    $('#ActiveStatus').append(`<option value=${item.id} selected>${item.activeStatusName}</option>`);
                }
                else {
                    $('#ActiveStatus').append(`<option value=${item.id}>${item.activeStatusName}</option>`);
                }

            });


        }
        if (responseObject.statusCode == 404 || responseObject.statusCode == 500) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}