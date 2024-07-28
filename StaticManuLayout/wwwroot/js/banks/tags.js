let _dataTable = undefined;
$(document).ready(function () {

    GetBankTagList();

    $('#submit_button').on('click', function () {
        let bankTagName = $('#BankTagName').val();
        let description = $('#Description').val();
        let bankTagId = $('#BankTagId').val();
        if (bankTagId == '') {
            bankTagId = 0;
        }

        let dataObj = {
            id: bankTagId,
            bankTagName: bankTagName,
            description: description,
        };

        let operationType = $('#operation_type').val();

        if (operationType == 'create') {


            $.ajax({
                url: '/api/Banks/CreateBankTag',
                type: 'POST',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#BankTagName').val('');
                    $('#Description').val('');
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    GetBankTagList();
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
                url: '/api/Banks/UpdateBankTag',
                type: 'PUT',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#BankTagName').val('');
                    $('#Description').val('');

                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    GetBankTagList();
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

function GetBankTagList() {
    var count = 0;

    if (_dataTable != undefined) {
        _dataTable.destroy();
    }


    _dataTable = $('#bank_tag_list_table').DataTable({
        ajax: {
            url: '/api/Banks/GetBankTags',
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
            { data: 'bankTagName' },
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
}

function onEditClicked(bankTagId) {
    $('#edit_modal').modal('show');
    $('#BankTagId').val(bankTagId);
}

function onEditConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _bankTagId = $('#BankTagId').val();
    $('#operation_type').val('edit');
    $('#submit_button').html('edit');
    $('#edit_modal').modal('hide');
    $.ajax({
        url: '/api/Banks/GetBankTagById?id=' + _bankTagId,
        type: 'GET',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            $('#BankTagName').val(responseObject.data.bankTagName);
            $('#Description').val(responseObject.data.description);
        }
        if (responseObject.statusCode == 404) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}

function onRemoveClicked(bankTagId) {
    $('#remove_modal').modal('show');
    $('#BankTagId').val(bankTagId);
}

function onRemoveConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _bankTagId = $('#BankTagId').val();
    $('#remove_modal').modal('hide');
    $.ajax({
        url: '/api/Banks/RemoveBankTag?id=' + _bankTagId,
        type: 'DELETE',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            GetBankTagList();
            showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
        }
        if (responseObject.statusCode == 404 || responseObject.statusCode == 500) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}