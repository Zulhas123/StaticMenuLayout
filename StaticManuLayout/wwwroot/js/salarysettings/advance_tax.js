﻿let _dataTable = undefined;
$(document).ready(function () {

    getAdvanceTaxList();

    $('#submit_button').on('click', function () {
        let taxId = $('#TaxId').val();
        let letterNo = $('#LetterNo').val();
        let amount = $('#Amount').val();
        let date = $('#Date').val();

        if (taxId == '') {
            taxId = 0;
        }


        let dataObj = {
            id: taxId,
            letterNo: letterNo,
            amount: amount,
            date: date,
        };

        let operationType = $('#operation_type').val();

        if (operationType == 'create') {


            $.ajax({
                url: '/api/SalarySettings/CreateAdvanceTax',
                type: 'POST',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#LetterNo').val('');
                    $('#Amount').val('');
                    $('#Date').val('');
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getAdvanceTaxList();
                }
                if (responseObject.statusCode == 400 || responseObject.statusCode == 409) {
                    for (let error in responseObject.errors) {
                        $(`#${error}`).empty();
                        $(`#${error}`).append(responseObject.errors[error]);
                    }
                    showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
                }
                if (responseObject.statusCode == 500) {
                    showToast(title = 'Error', message = 'Server error', toastrType = 'error');
                }
            });


        }
        else {

            $.ajax({
                url: '/api/Banks/UpdateBank',
                type: 'PUT',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#BankName').val('');
                    loadInitialData();
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getBankList();
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


function getAdvanceTaxList() {
    var count = 0;

    if (_dataTable != undefined) {
        _dataTable.destroy();
    }


    _dataTable = $('#advance_tax_list_table').DataTable({
        ajax: {
            url: '/api/SalarySettings/GetAdvanceTaxes',
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
            { data: 'letterNo' },
            { data: 'amount' },
            { data: 'date' },
            {
                data: 'id',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-primary btn-sm" onclick="javascript:void(0);">edit</button> <button type="button" class="btn btn-danger btn-sm" onclick="onRemoveClicked(${data})">delete</button>`;
                }
            },

        ]
    });

}

function onEditClicked(bankId) {
    $('#edit_modal').modal('show');
    $('#BankId').val(bankId);
}

function onEditConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _bankId = $('#BankId').val();
    $('#operation_type').val('edit');
    $('#submit_button').html('edit');
    $('#edit_modal').modal('hide');
    $.ajax({
        url: '/api/Banks/GetBankById?id=' + _bankId,
        type: 'GET',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            $('#BankName').val(responseObject.data.bankName);

            $('#BankTagId').empty();
            $('#BankTagId').append('<option value="0">select one</option>');
            $.each(bankTags, function (key, item) {
                if (item.id == responseObject.data.bankTagId) {
                    $('#BankTagId').append(`<option value=${item.id} selected>${item.bankTagName}</option>`);
                }
                else {
                    $('#BankTagId').append(`<option value=${item.id}>${item.bankTagName}</option>`);
                }

            });

            $('#BankTypeId').empty();
            $('#BankTypeId').append('<option value="0">select one</option>');
            $.each(bankTypes, function (key, item) {
                if (item.id == responseObject.data.bankTypeId) {
                    $('#BankTypeId').append(`<option value=${item.id} selected>${item.bankTypeName}</option>`);
                }
                else {
                    $('#BankTypeId').append(`<option value=${item.id}>${item.bankTypeName}</option>`);
                }

            });

        }
        if (responseObject.statusCode == 404) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}

function onRemoveClicked(taxId) {
    $('#remove_modal').modal('show');
    $('#TaxId').val(taxId);
}

function onRemoveConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _taxId = $('#TaxId').val();
    $('#remove_modal').modal('hide');
    $.ajax({
        url: '/api/SalarySettings/RemoveAdvanceTax?id=' + _taxId,
        type: 'DELETE',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            getAdvanceTaxList();
            showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
        }
        if (responseObject.statusCode == 404 || responseObject.statusCode == 500) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}