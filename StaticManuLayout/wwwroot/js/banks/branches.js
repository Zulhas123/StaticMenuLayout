let banks = [];
let _dataTable = undefined;
$(document).ready(function () {

    loadInitialData();
    getBranchist();

    $('#submit_button').on('click', function () {
        let branchId = $('#BranchId').val();
        let branchName = $('#BranchName').val();
        let routingNumber = $('#RoutingNumber').val();
        let bankId = $('#BankId').val();
        let address = $('#Address').val();

        if (branchId == '') {
            branchId = 0;
        }


        let dataObj = {
            id: branchId,
            branchName: branchName,
            routingNumber: routingNumber,
            bankId: bankId,
            address: address
        };

        let operationType = $('#operation_type').val();

        if (operationType == 'create') {


            $.ajax({
                url: '/api/Banks/CreateBranch',
                type: 'POST',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#BranchName').val('');
                    $('#RoutingNumber').val('');
                    $('#Address').val('');
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    loadInitialData();
                    getBranchist();
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
                url: '/api/Banks/UpdateBranch',
                type: 'PUT',
                async: false,
                data: dataObj
            }).always(function (responseObject) {
                $('.error-item').empty();
                if (responseObject.statusCode == 201) {
                    $('#BranchName').val('');
                    $('#RoutingNumber').val('');
                    $('#Address').val('');
                    loadInitialData();
                    showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                    getBranchist();
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
        url: '/api/Banks/GetBanks',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            banks = responseObject.data;
            $('#BankId').empty();
            $('#BankId').append('<option value="0">select one</option>');
            $.each(banks, function (key, item) {
                $('#BankId').append(`<option value=${item.id}>${item.bankName}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });
}


function getBranchist() {
    var count = 0;

    if (_dataTable != undefined) {
        _dataTable.destroy();
    }
    _dataTable = new DataTable('#branch_list_table', {
        initComplete: function () {
            this.api()
                .columns()
                .every(function (columnIndex) {
                    let column = this;
                    if (columnIndex == 1 || columnIndex == 2) {
                        // Create select element
                        let select = document.createElement('select');
                        select.style.cssText = 'width:100%;height:30px;border: 1px solid #dee2e6;';
                        select.add(new Option(''));
                        column.footer().replaceChildren(select);

                        // Apply listener for user change in value
                        select.addEventListener('change', function () {
                            column
                                .search(select.value, { exact: true })
                                .draw();
                        });

                        // Add list of options
                        column
                            .data()
                            .unique()
                            .sort()
                            .each(function (d, j) {
                                select.add(new Option(d));
                            });
                    }
                    if (columnIndex == 0) {
                        column.footer().replaceChildren(document.createElement('span').innerHTML = 'Filter');
                    }

                });
        },
        ajax: {
            url: '/api/Banks/GetBranches',
            dataSrc: 'data'
        },
        columns: [
            {
                data: '',
                render: function (data, type){
                    count++;
                    return count;
                }
            },
            { data: 'branchName' },
            {
                data: 'bankName'
            },
            { data: 'routingNumber' },
            { data: 'address' },
            {
                data: 'id',
                render: function (data, type, row){
                    return `<button type="button" class="btn btn-primary btn-sm" onclick="onEditClicked(${data})">edit</button> <button type="button" class="btn btn-danger btn-sm" onclick="onRemoveClicked(${data})">delete</button>`;
                }
            },

        ]
    });

}

function onEditClicked(branchId) {
    $('#edit_modal').modal('show');
    $('#BranchId').val(branchId);
}

function onEditConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _branchId = $('#BranchId').val();
    $('#operation_type').val('edit');
    $('#submit_button').html('edit');
    $('#edit_modal').modal('hide');
    $.ajax({
        url: '/api/Banks/GetBranchById?id=' + _branchId,
        type: 'GET',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            $('#BranchName').val(responseObject.data.branchName);
            $('#RoutingNumber').val(responseObject.data.routingNumber);
            $('#Address').val(responseObject.data.address);
            $('#BankId').empty();
            $('#BankId').append('<option value="0">select one</option>');
            $.each(banks, function (key, item) {
                if (item.id == responseObject.data.bankId) {
                    $('#BankId').append(`<option value=${item.id} selected>${item.bankName}</option>`);
                }
                else {
                    $('#BankId').append(`<option value=${item.id}>${item.bankName}</option>`);
                }

            });

        }
        if (responseObject.statusCode == 404) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}

function onRemoveClicked(branchId) {
    $('#remove_modal').modal('show');
    $('#BranchId').val(branchId);
}

function onRemoveConfirmed() {
    $('#remove_spin').removeClass('d-none');
    let _branchId = $('#BranchId').val();
    $('#remove_modal').modal('hide');
    $.ajax({
        url: '/api/Banks/RemoveBranch?id=' + _branchId,
        type: 'DELETE',
        async: false,
    }).always(function (responseObject) {
        if (responseObject.statusCode == 200) {
            getBranchist();
            $('#BranchName').val('');
            $('#RoutingNumber').val('');
            loadInitialData();
            showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
        }
        if (responseObject.statusCode == 404 || responseObject.statusCode == 500) {
            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
        }
        $('#remove_spin').addClass('d-none');
    });
}