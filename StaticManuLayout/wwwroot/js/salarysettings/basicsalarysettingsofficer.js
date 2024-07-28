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

        let like_basic = $('#like_basic').val();
        like_basic = like_basic == '' ? 0 : like_basic;

        let other_salary = $('#other_salary').val();
        other_salary = other_salary == '' ? 0 : other_salary;

        let education_allow = $('#education_allow').val();
        education_allow = education_allow == '' ? 0 : education_allow
            ;
        let wash_allow = $('#wash_allow').val();
        wash_allow = wash_allow == '' ? 0 : wash_allow;

        let h_allow_rate = $('#h_allow_rate').val();
        h_allow_rate = h_allow_rate == '' ? 0 : h_allow_rate;

        let h_allow = $('#h_allow').val();
        h_allow = h_allow == '' ? 0 : h_allow;

        let conveyance_allow = $('#conveyance_allow').val();
        conveyance_allow = conveyance_allow == '' ? 0 : conveyance_allow;

        let f_medical_allow = $('#f_medical_allow').val();
        f_medical_allow = f_medical_allow == '' ? 0 : f_medical_allow;
        
        let officer_pf = $('#officer_pf').val();
        officer_pf = officer_pf == '' ? 0 : officer_pf;

        let field_risk_allow = $('#field_risk_allow').val();
        field_risk_allow = field_risk_allow == '' ? 0 : field_risk_allow;

        let charge_allow = $('#charge_allow').val();
        charge_allow = charge_allow == '' ? 0 : charge_allow;

        let daid_allow = $('#daid_allow').val();
        daid_allow = daid_allow == '' ? 0 : daid_allow;

        let deputation_allow = $('#deputation_allow').val();
        deputation_allow = deputation_allow == '' ? 0 : deputation_allow;

        let h_rent_return = $('#h_rent_return').val();
        h_rent_return = h_rent_return == '' ? 0 : h_rent_return;

        let dormitory_deduction = $('#dormitory_deduction').val();
        dormitory_deduction = dormitory_deduction == '' ? 0 : dormitory_deduction;

        let fuel_return = $('#fuel_return').val();
        fuel_return = fuel_return == '' ? 0 : fuel_return;

        let monthly_tax = $('#monthly_tax').val();
        monthly_tax = monthly_tax == '' ? 0 : monthly_tax;

        let cme = $('#CME').val();
        cme = cme == '' ? 0 : cme;

        let pf_checkbox = $('#pf_checkbox').is(":checked");
        let wf_checkbox = $('#wf_checkbox').is(":checked");
        let cos_checkbox = $('#cos_checkbox').is(":checked");
        let medical_checkbox = $('#medical_checkbox').is(":checked");
        let off_club_checkbox = $('#off_club_checkbox').is(":checked");
        let off_association_checkbox = $('#off_association').is(":checked");
        let payModeId = $('#pay_mode').val();
        let bankId = $('#bank').val();
        let branchId = $('#branch').val();
        let account_number = $('#account_number').val();

        let _object = {
            jobCode: jobCode,
            basicSalary: parseFloat(basic_salary),
            personalPay: parseFloat(personal_pay),
            likeBasic: parseFloat(like_basic),
            otherSalary: parseFloat(other_salary),
            educationAllow: parseFloat(education_allow),
            washAllow: parseFloat(wash_allow),
            houseRentAllowRate: parseFloat(h_allow_rate),
            houseRentAllow: parseFloat(h_allow),
            conveyanceAllow: parseFloat(conveyance_allow),
            familyMedicalAllow: parseFloat(f_medical_allow),
            officerPF: parseFloat(officer_pf),
            fieldRiskAllow: parseFloat(field_risk_allow),
            chargeAllow: parseFloat(charge_allow),
            dAidAllow: parseFloat(daid_allow),
            deputationAllow: parseFloat(deputation_allow),
            houseRentReturn: parseFloat(h_rent_return),
            dormitoryDeduction: parseFloat(dormitory_deduction),
            fuelReturn: parseFloat(fuel_return),
            isMemberPF: pf_checkbox,
            isMemberWF: wf_checkbox,
            isMemberCOS: cos_checkbox,
            isMemberMedical: medical_checkbox,
            isMemberOffClub: off_club_checkbox,
            isMemberOffAsso: off_association_checkbox,
            payModeId: payModeId,
            bankId: bankId,
            bankBranchId: branchId,
            accountNumber: account_number,
            monthlyTaxDeduction: parseFloat(monthly_tax),
            cme: parseFloat(cme)
        };

        if (_operationType == 'edit') {
            jobCode = $('#job_code_hidden').val();
            _object.jobCode = jobCode;

            $.ajax({
                url: '/api/SalarySettings/UpdateSalarySettingsOfficer',
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
                url: '/api/SalarySettings/CreateSalarySettingsOfficer',
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

function loadInitialData(refreshFields = 0) {

    $.ajax({
        url: '/api/SalarySettings/GetEmployeesForSalarySetting?employeeTypeId=1',
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
            payModes = responseObject.data;
            $('#bank').empty();
            $('#branch').empty();
            $('#bank').append(`<option value='0'>select one</option>`);
            $.each(payModes, function (key, item) {
                $('#bank').append(`<option value=${item.id}>${item.bankName}</option>`);
            });

        },
        error: function (responseObject) {
        }
    });

    if (_dataTable != undefined) {
        _dataTable.destroy();
    }
    _dataTable = $('#basic_salary_setting_off_list_table').DataTable({
        ajax: {
            url: '/api/SalarySettings/GetSalaryettingsOfficers',
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
        $('#like_basic').val('');
        $('#other_salary').val('');
        $('#education_allow').val('');
        $('#wash_allow').val('');
        $('#h_allow_rate').val('');
        $('#h_allow').val('');
        $('#conveyance_allow').val('');
        $('#f_medical_allow').val('');
        $('#officer_pf').val('');
        $('#field_risk_allow').val('');
        $('#charge_allow').val('');
        $('#daid_allow').val('');
        $('#deputation_allow').val('');
        $('#h_rent_return').val('');
        $('#dormitory_deduction').val('');
        $('#fuel_return').val('');
        $('#monthly_tax').val('');
        $('#CME').val('');
        $('#pf_checkbox').prop('checked', false);
        $('#wf_checkbox').prop('checked', false);
        $('#cos_checkbox').prop('checked', false);
        $('#medical_checkbox').prop('checked', false);
        $('#off_club_checkbox').prop('checked', false);
        $('#off_association').prop('checked', false);
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
        url: '/api/SalarySettings/GetSalaryettingsOfficersByJobCode?jobCode=' + _jobCode,
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
        $('#like_basic').val(responseObject.data.likeBasic);
        $('#other_salary').val(responseObject.data.otherSalary);
        $('#education_allow').val(responseObject.data.educationAllow);
        $('#wash_allow').val(responseObject.data.washAllow);
        $('#h_allow_rate').val(responseObject.data.houseRentAllowRate);
        $('#h_allow').val(responseObject.data.houseRentAllow);
        $('#conveyance_allow').val(responseObject.data.conveyanceAllow);
        $('#f_medical_allow').val(responseObject.data.familyMedicalAllow);
        $('#officer_pf').val(responseObject.data.officerPF);
        $('#field_risk_allow').val(responseObject.data.fieldRiskAllow);
        $('#charge_allow').val(responseObject.data.chargeAllow);
        $('#daid_allow').val(responseObject.data.dAidAllow);
        $('#deputation_allow').val(responseObject.data.deputationAllow);
        $('#h_rent_return').val(responseObject.data.houseRentReturn);
        $('#dormitory_deduction').val(responseObject.data.dormitoryDeduction);
        $('#fuel_return').val(responseObject.data.fuelReturn);
        $('#monthly_tax').val(responseObject.data.monthlyTaxDeduction);
        $('#CME').val(responseObject.data.cme);
        $('#pf_checkbox').prop('checked', responseObject.data.isMemberPF);
        $('#wf_checkbox').prop('checked', responseObject.data.isMemberWF);
        $('#cos_checkbox').prop('checked', responseObject.data.isMemberCOS);
        $('#medical_checkbox').prop('checked', responseObject.data.isMemberMedical);
        $('#off_club_checkbox').prop('checked', responseObject.data.isMemberOffClub);
        $('#off_association').prop('checked', responseObject.data.isMemberOffAsso);
    });
}

