let bankTags = [];
let bankTypes = [];
let _dataTable = undefined;
$(document).ready(function () {

    loadInitialData();
    getBankList();

    $('#submit_button').on('click', function () {
        let bankId = $('#BankId').val();
        let bankName = $('#BankName').val();
        let bankTagId = $('#BankTagId').val();
        let bankTypeId = $('#BankTypeId').val();

        if (bankId=='') {
            bankId = 0;
        }


        let dataObj = {
            id: bankId,
            bankName: bankName,
            bankTagId: bankTagId,
            bankTypeId: bankTypeId,
        };

        let operationType = $('#operation_type').val();

        if (operationType == 'create') {


            $.ajax({
                url: '/api/Banks/CreateBank',
                type: 'POST',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#BankName').val('');
                    loadInitialData();
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getBankList();
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

function loadInitialData() {
    $.ajax({
        url: '/api/Banks/GetBankTags',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            bankTags = responseObject.data;
            $('#BankTagId').empty();
            $('#BankTagId').append('<option value="0">select one</option>');
            $.each(bankTags, function (key, item) {
                $('#BankTagId').append(`<option value=${item.id}>${item.bankTagName}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });

    $.ajax({
        url: '/api/Banks/GetBankTypes',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            bankTypes = responseObject.data;
            $('#BankTypeId').empty();
            $('#BankTypeId').append('<option value="0">select one</option>');
            $.each(bankTypes, function (key, item) {
                $('#BankTypeId').append(`<option value=${item.id}>${item.bankTypeName}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });
}

function getBankList() {
    var count = 0;

    if (_dataTable != undefined) {
        _dataTable.destroy();
    }


    _dataTable = $('#bank_list_table').DataTable({
        ajax: {
            url: '/api/Banks/GetBanks',
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
            { data: 'bankName' },
            { data: 'bankTagName' },
            { data: 'bankTypeName' },
            {
                data: 'id',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-primary btn-sm" onclick="onEditClicked(${data})">edit</button> <button type="button" class="btn btn-danger btn-sm" onclick="onRemoveClicked(${data})">delete</button>`;
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

function onRemoveClicked(bankId) {
    $('#remove_modal').modal('show');
    $('#BankId').val(bankId);
}

function onRemoveConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _bankId = $('#BankId').val();
    $('#remove_modal').modal('hide');
    $.ajax({
        url: '/api/Banks/RemoveBank?id=' + _bankId,
        type: 'DELETE',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            getBankList();
            showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
        }
        if (responseObject.statusCode == 404 || responseObject.statusCode == 500) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}