let _dataTable = undefined;
$(document).ready(function () {

    loadInitialData();
    getBonusList();
    $('#create_button').on('click', function () {
        let _monthId = getMonthId();
        let _bonusTitle = $('#BonusTitle').val();
        let bonusId = $('#BonusId').val();
        if (bonusId == '') {
            bonusId = 0;
        }

        let _obj = {
            id: bonusId,
            bonusTitle: _bonusTitle,
            payableMonth: _monthId,
            statusOF: 0,
            statusJS:0
        };
        let operationType = $('#operation_type').val();
        if (operationType == 'create') {
            $.ajax({
                url: `/api/Bonus/CreateBonus`,
                type: 'POST',
                async: false,
                //dataType: 'json',
                data: _obj,
                success: function (responseObject) {
                    if (responseObject.statusCode == 201) {
                        $('#BonusTitle').val('');
                        showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                        getBonusList();
                    }
                    if (responseObject.statusCode == 500) {
                        showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
                    }
                    if (responseObject.statusCode == 400) {
                        showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
                    }
                    if (responseObject.statusCode == 409) {
                        showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
                    }
                },
                error: function (responseObject) {
                }
            });
        }
        else {
            $.ajax({
                url: `/api/Bonus/UpdateBonus`,
                type: 'PUT',
                async: false,
                //dataType: 'json',
                data: _obj,
                success: function (responseObject) {
                    $('.error-item').empty();

                    if (responseObject.statusCode == 201) {
                        $('#BonusTitle').val('');
                        showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                        getBonusList();
                    }
                    if (responseObject.statusCode == 500) {
                        showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
                    }
                    if (responseObject.statusCode == 400 || responseObject.statusCode == 404) {
                        for (let error in responseObject.errors) {
                            $(`#${error}`).empty();
                            $(`#${error}`).append(responseObject.errors[error]);
                        }
                        showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
                    }
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
        url: '/api/Others/GetMonths',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            let months = responseObject.data;
            let currentMonth = new Date().getMonth() + 1;
            $('#months').empty();
            $.each(months, function (key, item) {
                if (currentMonth == parseInt(item.monthId)) {
                    $('#months').append(`<option value=${item.monthId} selected>${item.monthName}</option>`);
                }
                else {
                    $('#months').append(`<option value=${item.monthId}>${item.monthName}</option>`);
                }

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
                if (item == currentYear) {
                    $('#years').append(`<option value=${item} selected>${item}</option>`);
                }
                else {
                    $('#years').append(`<option value=${item}>${item}</option>`);
                }
            });
        },
        error: function (responseObject) {
        }
    });

}

function getBonusList() {
    let count = 0;

    if (_dataTable != undefined) {
        _dataTable.destroy();
    }


    _dataTable = $('#bonus_list_table').DataTable({
        ajax: {
            url: '/api/Bonus/GetBonus',
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
            { data: 'bonusTitle' },
            { data: 'payableMonth' },
            {
                data: 'id',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-primary btn-sm" onclick="onEditClicked(${data})">edit</button> <button type="button" class="btn btn-danger btn-sm" onclick="onRemoveClicked(${data})">delete</button>`;
                }
            },

        ]
    });

}

function onRemoveClicked(bonusId) {
    $('#remove_modal').modal('show');
    $('#BonusId').val(bonusId);
}

function onRemoveConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _bonusId = $('#BonusId').val();
    $('#remove_modal').modal('hide');
    $.ajax({
        url: '/api/Bonus/RemoveBonus?id=' + _bonusId,
        type: 'DELETE',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            getBonusList();
            showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
        }
        if (responseObject.statusCode == 404 || responseObject.statusCode == 500) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}

function onEditClicked(bonusId) {
    $('#edit_modal').modal('show');
    $('#BonusId').val(bonusId);
}

function onEditConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _bonusId = $('#BonusId').val();
    $('#operation_type').val('edit');
    $('#submit_button').html('edit');
    $('#edit_modal').modal('hide');
    $.ajax({
        url: '/api/Bonus/GetBonusById?id=' + _bonusId,
        type: 'GET',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            $('#BonusTitle').val(responseObject.data.bonusTitle);
            let payableMonth = parseInt(responseObject.data.payableMonth);
            let year = Math.trunc(payableMonth / 100);
            let month = payableMonth % 100;


            $.ajax({
                url: '/api/Others/GetMonths',
                type: 'Get',
                async: false,
                dataType: 'json',
                success: function (responseObject) {
                    let months = responseObject.data;
                    $('#months').empty();
                    $.each(months, function (key, item) {
                        if (month == parseInt(item.monthId)) {
                            $('#months').append(`<option value=${item.monthId} selected>${item.monthName}</option>`);
                        }
                        else {
                            $('#months').append(`<option value=${item.monthId}>${item.monthName}</option>`);
                        }

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
                    $('#years').empty();
                    $.each(years, function (key, item) {
                        if (item == year) {
                            $('#years').append(`<option value=${item} selected>${item}</option>`);
                        }
                        else {
                            $('#years').append(`<option value=${item}>${item}</option>`);
                        }
                    });
                },
                error: function (responseObject) {
                }
            });



        }
        if (responseObject.statusCode == 404 || responseObject.statusCode == 500) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}
