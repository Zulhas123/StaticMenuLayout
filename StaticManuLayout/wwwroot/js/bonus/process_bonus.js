
$(document).ready(function () {

    loadInitialData();

    $('#months').on('change', function () {
        let monthId = getMonthId();
        $('#bonus_form').css('display', 'none');
        $.ajax({
            url: '/api/Bonus/GetBonusByMonthId?monthId=' + monthId,
            type: 'Get',
            async: false,
            dataType: 'json',
            success: function (responseObject) {
                let bonus = responseObject.data;
                $('#BonusId').empty();
                $('#BonusId').append(`<option value='0'>Select Bonus</option>`);
                $.each(bonus, function (key, item) {
                    $('#BonusId').append(`<option value=${item.Id}>${item.bonusTitle}</option>`);

                });
            },
            error: function (responseObject) {
            }
        });

    });

    $('#years').on('change', function () {
        let monthId = getMonthId();
        $('#bonus_form').css('display', 'none');
        $.ajax({
            url: '/api/Bonus/GetBonusByMonthId?monthId=' + monthId,
            type: 'Get',
            async: false,
            dataType: 'json',
            success: function (responseObject) {
                let bonus = responseObject.data;
                $('#BonusId').empty();
                $('#BonusId').append(`<option value='0'>Select Bonus</option>`);
                $.each(bonus, function (key, item) {
                    $('#BonusId').append(`<option value=${item.id}>${item.bonusTitle}</option>`);

                });
            },
            error: function (responseObject) {
            }
        });
    });

    $('#BonusId').on('change', () => {
        let bonusId = $('#BonusId').val();
        if (parseInt(bonusId) > 0) {
            $('#bonus_form').css('display','block');
        }
    });

    $('#process_button').on('click', () => {
       
        let bonusId = $('#BonusId').val();
        let employeeType = $('#EmployeeTypeId').val();

        let dataObj = {
            bonusId: bonusId,
            bonusName:'',
            EmployeeTypeId: employeeType,
            hindu: false,
            muslim: false,
            buddist: false,
            christian: false,
            basic:0
        };


        let festivalBonus = $('#festival_checkbox').is(":checked");
        let incentiveBonus = $('#incentive_checkbox').is(":checked");
        let honorariumBonus = $('#honorarium_checkbox').is(":checked");
        let scholarshipBonus = $('#scholarship_checkbox').is(":checked");

        if (festivalBonus) {

            dataObj.bonusName = 'festival';

            let basic = $('#festival_basic').val();
            basic = basic == '' ? 0 : basic;
            dataObj.basic = basic;

            let muslim = $('#muslim_checkbox').is(":checked");
            let hindu = $('#hindu_checkbox').is(":checked");
            let buddist = $('#buddist_checkbox').is(":checked");
            let christian = $('#christian_checkbox').is(":checked");
            if (muslim) {
                dataObj.muslim = true;
            }
            if (hindu) {
                dataObj.hindu = true;
            }
            if (buddist) {
                dataObj.buddist = true;
            }
            if (christian) {
                dataObj.christian = true;
            }

            $.ajax({
                url: '/api/Bonus/ProcessBonus',
                type: 'POST',
                async: false,
                data: dataObj,
                success: function (responseObject) {
                   
                },
                error: function (responseObject) {
                }
            });


        }
        if (incentiveBonus) {
            dataObj.bonusName = 'incentive';

            let basic = $('#incentive_basic').val();
            basic = basic == '' ? 0 : basic;
            dataObj.basic = basic;

            $.ajax({
                url: '/api/Bonus/ProcessBonus',
                type: 'POST',
                async: false,
                data: dataObj,
                success: function (responseObject) {

                },
                error: function (responseObject) {
                }
            });
        }
        if (honorariumBonus) {
            dataObj.bonusName = 'honorarium';

            let basic = $('#honorarium_basic').val();
            basic = basic == '' ? 0 : basic;
            dataObj.basic = basic;

            $.ajax({
                url: '/api/Bonus/ProcessBonus',
                type: 'POST',
                async: false,
                data: dataObj,
                success: function (responseObject) {

                },
                error: function (responseObject) {
                }
            });
        }
        if (scholarshipBonus) {
            dataObj.bonusName = 'scholarship';

            let basic = $('#scholarship_basic').val();
            basic = basic == '' ? 0 : basic;
            dataObj.basic = basic;

            $.ajax({
                url: '/api/Bonus/ProcessBonus',
                type: 'POST',
                async: false,
                data: dataObj,
                success: function (responseObject) {

                },
                error: function (responseObject) {
                }
            });
        }

    });

});

function getMonthId() {
    let month = $('#months').val();
    let year = $('#years').val();

    return (parseInt(year) * 100) + parseInt(month);
}

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
                if (item.id != 3 && item.id != 4) {
                    $('#EmployeeTypeId').append(`<option value=${item.id}>${item.employeeTypeName}</option>`);
                }

            });
        },
        error: function (responseObject) {
        }
    });

    $.ajax({
        url: '/api/Others/GetMonths',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            let months = responseObject.data;
            let currentMonth = new Date().getMonth() + 1;
            $('#months').empty();
            $.each(months, function (key, item) {
                $('#months').append(`<option value=${item.monthId}>${item.monthName}</option>`);

            });
        },
        error: function (responseObject) {
        }
    });

    $.ajax({
        url: '/api/Others/GetYears',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            let years = responseObject.data;
            let currentYear = new Date().getFullYear();
            $('#years').empty();
            $.each(years, function (key, item) {
                $('#years').append(`<option value=${item}>${item}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });

}


