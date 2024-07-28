let employees = [];
let _dataTable = undefined;
$(document).ready(function () {

    loadInitialData();

    $('#job_code').on('change', function () {
        let employeeId = $(this).find(":selected").val();
        let jobCode = $(this).find(":selected").text();
        if (employeeId.toString() == '0') {
            $('#job_code_error').html('Select a valid Job Code');
            $('#empoyee_name').val('');
            $('#designation').val('');
            $('#department').val('');
        }
        else {
            $('#job_code_error').empty();
            // get emplopyee info
            $.ajax({
                url: '/api/Employees/GetEmployeeViewById?id=' + employeeId,
                type: 'Get',
                async: false,
                dataType: 'json',
                success: function (responseObject) {
                    _data = responseObject.data;
                    $('#empoyee_name').val(_data.employeeName);
                    $('#designation').val(_data.designationName);
                    $('#department').val(_data.departmentName);

                },
                error: function (responseObject) {
                }
            });
            // get salary settings for officer
            $.ajax({
                url: '/api/SalarySettings/GetSalarySettingsOfficerByJobCode?jobcode=' + jobCode,
                type: 'Get',
                async: false,
                dataType: 'json',
                success: function (responseObject) {
                    _data = responseObject.data;
                    console.log(_data);

                },
                error: function (responseObject) {
                }
            });
        }

    });

    $('#submit_button').on('click', function () {
        let _operationType = $('#operation_type').val();

        let jobCode = $('#job_code').find(":selected").text();

        let basic_salary = $('#basic_salary').val();
        basic_salary = basic_salary == '' ? 0 : basic_salary;

        let personal_pay = $('#personal_pay').val();
        personal_pay = personal_pay == '' ? 0 : personal_pay;

        let convenience_allow = $('#convenience_allow').val();
        convenience_allow = convenience_allow == '' ? 0 : convenience_allow;

        let other_salary = $('#other_salary').val();
        other_salary = other_salary == '' ? 0 : other_salary;

        let h_allow_rate = $('#h_allow_rate').val();
        h_allow_rate = h_allow_rate == '' ? 0 : h_allow_rate;

        let h_allow = $('#h_allow').val();
        h_allow = h_allow == '' ? 0 : h_allow;

        let f_medical_allow = $('#f_medical_allow').val();
        f_medical_allow = f_medical_allow == '' ? 0 : f_medical_allow;

        let fuel_return = $('#fuel_return').val();
        fuel_return = fuel_return == '' ? 0 : fuel_return;

        let education_allow = $('#education_allow').val();
        education_allow = education_allow == '' ? 0 : education_allow;

        let field_allow = $('#field_allow').val();
        field_allow = field_allow == '' ? 0 : field_allow;

        let dormitory_deduction = $('#dormitory_deduction').val();
        dormitory_deduction = dormitory_deduction == '' ? 0 : dormitory_deduction;

        let provident_fund = $('#provident_fund').val();
        provident_fund = provident_fund == '' ? 0 : provident_fund;

        let pf_checkbox = $('#pf_checkbox').is(":checked");
        let wf_checkbox = $('#wf_checkbox').is(":checked");

        let cos_checkbox = $('#cos_checkbox').is(":checked");
        let emp_club_checkbox = $('#emp_club_checkbox').is(":checked");
        let emp_union = $('#emp_union').is(":checked");
        let payModeId = $('#pay_mode').val();
        let bankId = $('#bank').val();

        let branchId = $('#branch').val();
        let account_number = $('#account_number').val();

        let _object = {
            jobCode: jobCode,
            basicSalary: parseFloat(basic_salary),
            personalPay: parseFloat(personal_pay),
            convenienceAllow: parseFloat(convenience_allow),
            otherSalary: parseFloat(other_salary),
            
            houseRentAllowRate: parseFloat(h_allow_rate),
            houseRentAllow: parseFloat(h_allow),
            familyMedicalAllow: parseFloat(f_medical_allow),
            fuelReturn: parseFloat(fuel_return),
            educationAllow: parseFloat(education_allow),

            fieldAllow: parseFloat(field_allow),
            dormitoryDeduction: parseFloat(dormitory_deduction),
            providentFund: parseFloat(provident_fund),
            isMemberPF: pf_checkbox,
            isMemberWF: wf_checkbox,

            isMemberCOS: cos_checkbox,
            isMemberEmpClub: emp_club_checkbox,
            isMemberEmpUnion: emp_union,
            payModeId: payModeId,
            bankId: bankId,

            bankBranchId: branchId,
            accountNumber: account_number,
        };


        if (_operationType == 'edit') {
            jobCode = $('#job_code_hidden').val();
            _object.jobCode = jobCode;

            $.ajax({
                url: '/api/SalarySettings/UpdateSalarySettingsJuniorStaff',
                type: 'POST',
                async: false,
                data: _object,
                success: function (responseObject) {
                    if (responseObject.statusCode == 201) {
                        $('#operation_type').val('save');
                        $('#submit_button').html('save');
                        $('.job_code_flag').css('display', 'block');
                        $('.job_code_show_flag').css('display', 'none');
                        $('.cancel_button_show').css('display', 'none');
                        loadInitialData(1);
                        showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    }
                    if (responseObject.statusCode == 500) {
                        showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
                    }
                },
                error: function (responseObject) {
                }
            });
        }
        else {
            $.ajax({
                url: '/api/SalarySettings/CreateSalarySettingsJuniorStaff',
                type: 'POST',
                async: false,
                data: _object,
                success: function (responseObject) {
                    if (responseObject.statusCode == 201) {
                        loadInitialData(1);
                        showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    }
                    if (responseObject.statusCode == 500) {
                        showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
                    }
                },
                error: function (responseObject) {
                }
            });
        }
        
    });

    $('#bank').on('change', function () {
        debugger;
        let bankId = $(this).val();
        $('#branch').empty();

        $.ajax({
            url: '/api/Banks/GetBranchesByBankId?bankId=' + bankId,
            type: 'Get',
            async: false,
            dataType: 'json',
            success: function (responseObject) {
                branches = responseObject.data;
                console.log(branches)
                $('#branch').append(`<option value='0'>select one</option>`);
                $.each(branches, function (key, item) {
                    $('#branch').append(`<option value=${item.id}>${item.branchName}</option>`);
                });

            },
            error: function (responseObject) {
            }
        });
    });

    $('#cancel_button').on('click', () => {
        location.reload();
    });

});

function loadInitialData(refreshFields=0) {

    $.ajax({
        url: '/api/SalarySettings/GetEmployeesForSalarySetting?employeeTypeId=2',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            employees = responseObject.data;
            $('#job_code').empty();
            $('#job_code').append(`<option value='0'>select one</option>`);
            $.each(employees, function (key, item) {
                $('#job_code').append(`<option value=${item.id}>${item.jobCode}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });

    $.ajax({
        url: '/api/SalarySettings/GetPayModes',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            payModes = responseObject.data;
            $('#pay_mode').empty();
            $('#pay_mode').append(`<option value='0'>select one</option>`);
            $.each(payModes, function (key, item) {
                $('#pay_mode').append(`<option value=${item.id}>${item.payModeName}</option>`);
            });

        },
        error: function (responseObject) {
        }
    });

    $.ajax({
        url: '/api/Banks/GetBanks',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            banks = responseObject.data;
            $('#bank').empty();
            $('#branch').empty();
            $('#bank').append(`<option value='0'>select one</option>`);
            $.each(banks, function (key, item) {
                $('#bank').append(`<option value=${item.id}>${item.bankName}</option>`);
            });

        },
        error: function (responseObject) {
        }
    });


    if (_dataTable != undefined) {
        _dataTable.destroy();
    }
    _dataTable = $('#basic_salary_setting_js_list_table').DataTable({
        ajax: {
            url: '/api/SalarySettings/GetSalaryettingsJuniorStaff',
            dataSrc: 'data'
        },
        columns: [
            {
                data: 'jobCode',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-primary btn-sm" onclick="onEditClicked('${data}')">edit</button>`;
                }
            },
            { data: 'jobCode' },
            { data: 'employeeName' },
            { data: 'designationName' },
            { data: 'departmentName' }
        ]
    });

    if (refreshFields == 1) {
        $('#empoyee_name').val('');
        $('#designation').val('');
        $('#department').val('');
        $('#job_code_show').val('');
        $('#account_number').val('');
        $('#basic_salary').val('');
        $('#personal_pay').val('');
        $('#convenience_allow').val('');
        $('#other_salary').val('');
        $('#h_allow_rate').val('');
        $('#h_allow').val('');
        $('#f_medical_allow').val('');
        $('#fuel_return').val('');
        $('#education_allow').val('');
        $('#field_allow').val('');
        $('#dormitory_deduction').val('');
        $('#provident_fund').val('');
        $('#pf_checkbox').prop('checked', false);
        $('#wf_checkbox').prop('checked', false);
        $('#cos_checkbox').prop('checked', false);
        $('#emp_club_checkbox').prop('checked', false);
        $('#emp_union').prop('checked', false);
    }
}

function onEditClicked(job_code) {
    $('#edit_modal').modal('show');
    $('#job_code_hidden').val(job_code);
}

function onEditConfirmed() {
   
    $('#remove_spin').removeClass('d-none');
    let _jobCode = $('#job_code_hidden').val();
    $('#operation_type').val('edit');
    $('#submit_button').html('edit');
    $('#edit_modal').modal('hide');
    $('.job_code_flag').css('display', 'none');
    $('.job_code_show_flag').css('display', 'block');
    $('.cancel_button_show').css('display', 'inline-block');

    $.ajax({
        url: '/api/SalarySettings/GetSalaryettingsJuniorStaffByJobCode?jobCode=' + _jobCode,
        type: 'GET',
        async: false,
    }).always(function (responseObject) {

        $.ajax({
            url: '/api/Employees/GetEmployeeViewByJobCode?jobcode=' + _jobCode,
            type: 'Get',
            async: false,
            dataType: 'json',
            success: function (employeeResponseObject) {
                _data = employeeResponseObject.data;
                $('#empoyee_name').val(_data.employeeName);
                $('#designation').val(_data.designationName);
                $('#department').val(_data.departmentName);

            },
            error: function (responseObject) {
            }
        });


        $.ajax({
            url: '/api/SalarySettings/GetPayModes',
            type: 'Get',
            async: false,
            dataType: 'json',
            success: function (payMOdeResponseObject) {
                $('#pay_mode').empty();
                payModes = payMOdeResponseObject.data;
                $('#pay_mode').append(`<option value='0'>select one</option>`);
                $.each(payModes, function (key, item) {
                    if (parseInt(item.id) == parseInt(responseObject.data.payModeId)) {
                        $('#pay_mode').append(`<option value=${item.id} selected>${item.payModeName}</option>`);
                    }
                    else {
                        $('#pay_mode').append(`<option value=${item.id}>${item.payModeName}</option>`);
                    }
                    
                });

            },
            error: function (responseObject) {
            }
        });

        $.ajax({
            url: '/api/Banks/GetBanks',
            type: 'Get',
            async: false,
            dataType: 'json',
            success: function (bankResponseObject) {
                $('#bank').empty();
                banks = bankResponseObject.data;
                $('#bank').append(`<option value='0'>select one</option>`);
                $.each(banks, function (key, item) {
                    if (parseInt(item.id) == parseInt(responseObject.data.bankId)) {
                        $('#bank').append(`<option value=${item.id} selected>${item.bankName}</option>`);
                    } else {
                        $('#bank').append(`<option value=${item.id}>${item.bankName}</option>`);
                    }
                    
                });

                $.ajax({
                    url: '/api/Banks/GetBranchesByBankId?bankId=' + responseObject.data.bankId,
                    type: 'Get',
                    async: false,
                    dataType: 'json',
                    success: function (branchResponseObject) {
                        $('#branch').empty();
                        branches = branchResponseObject.data;
                        $('#branch').append(`<option value='0'>select one</option>`);
                        $.each(branches, function (key, item) {
                            if (parseInt(item.id) == parseInt(responseObject.data.bankBranchId)) {
                                $('#branch').append(`<option value=${item.id} selected>${item.branchName}</option>`);
                            }
                            else {
                                $('#branch').append(`<option value=${item.id}>${item.branchName}</option>`);
                            }
                            
                        });

                    },
                    error: function (responseObject) {
                    }
                });

            },
            error: function (responseObject) {
            }
        });

        $('#job_code_show').val(_jobCode);
        $('#account_number').val(responseObject.data.accountNumber);
        $('#basic_salary').val(responseObject.data.basicSalary);
        $('#personal_pay').val(responseObject.data.personalPay);
        $('#convenience_allow').val(responseObject.data.convenienceAllow);
        $('#other_salary').val(responseObject.data.otherSalary);
        $('#h_allow_rate').val(responseObject.data.houseRentAllowRate);
        $('#h_allow').val(responseObject.data.houseRentAllow);
        $('#f_medical_allow').val(responseObject.data.familyMedicalAllow);
        $('#fuel_return').val(responseObject.data.fuelReturn);
        $('#education_allow').val(responseObject.data.educationAllow);
        $('#field_allow').val(responseObject.data.fieldAllow);
        $('#dormitory_deduction').val(responseObject.data.dormitoryDeduction);
        $('#provident_fund').val(responseObject.data.providentFund);
        $('#pf_checkbox').prop('checked', responseObject.data.isMemberPF);
        $('#wf_checkbox').prop('checked', responseObject.data.isMemberWF);
        $('#cos_checkbox').prop('checked', responseObject.data.isMemberCOS);
        $('#emp_club_checkbox').prop('checked', responseObject.data.isMemberEmpClub);
        $('#emp_union').prop('checked', responseObject.data.isMemberEmpUnion);

    });
}