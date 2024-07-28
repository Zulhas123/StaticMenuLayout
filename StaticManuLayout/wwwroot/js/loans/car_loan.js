let _dataTable = undefined;
$(document).ready(function () {
    getCarLoans();
    initialLoads();

    $('#submit_button').on('click', function () {
        let jobCode = $('#JobCode :selected').text();
        let totalLoanAmount = $('#TotalLoanAmount').val();
        totalLoanAmount = totalLoanAmount == "" ? 0 : parseFloat(totalLoanAmount);
        let loanTakenDate = $('#LoanTakenDateString').val();
        let interestRate = $('#InterestRate').val();
        interestRate = interestRate == "" ? 0 : parseFloat(interestRate);
        let installmentNo = $('#InstallmentNo').val();
        installmentNo = installmentNo == "" ? 0 : parseFloat(installmentNo);
        let depreciationAmount = $('#DepreciationAmount').val();
        depreciationAmount = depreciationAmount == "" ? 0 : parseFloat(depreciationAmount);
        let actualAmount = $('#ActualAmount').val();
        actualAmount = actualAmount == "" ? 0 : parseFloat(actualAmount);

        let dataObj = {
            jobCode: jobCode,
            totalLoanAmount: totalLoanAmount,
            loanTakenDateString: loanTakenDate,
            interestRate: interestRate,
            installmentNo: installmentNo,
            depreciationAmount: depreciationAmount,
            actualAmount: actualAmount
        };

        $.ajax({
            url: '/api/Loans/CreateCarLoan',
            type: 'POST',
            async: false,
            data: dataObj
        }).always(function (responseObject) {
            $('.error-item').empty();
            if (responseObject.statusCode == 201) {
                $('#TotalLoanAmount').val('');
                $('#LoanTakenDateString').val('');
                $('#InterestRate').val('');
                $('#InstallmentNo').val('');
                $('#DepreciationAmount').val('');
                $('#ActualAmount').val('');

                initialLoads();
                showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
                getCarLoans();
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
    });
});

function onEditClicked(rowId) {
    
    $.ajax({
        url: '/api/Loans/GetCarLoanInstallments?loanId=' + rowId,
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {

            if (responseObject.statusCode == 200) {
                carLoanInstallmentsData = responseObject.data;
                $('#car_loan_installments_table tbody').empty();
                let count = 1;
                for (let x = 0; x < carLoanInstallmentsData.length; x++) {
                    let status = '';
                    if (carLoanInstallmentsData[x].isPaid) {
                        status = 'Paid';
                    }
                    else {
                        status = 'Unpaid';
                    }
                    
                    $('#car_loan_installments_table tbody').append(`
                    <tr>
                        <td style='text-align:center;'>${count}</td>
                        <td style='text-align:center;'>${carLoanInstallmentsData[x].monthId}</td>
                        <td style='text-align:right;'>${carLoanInstallmentsData[x].principalAmount}</td>
                        <td style='text-align:right;'>${carLoanInstallmentsData[x].interestAmount}</td>
                        <td style='text-align:right;'>${carLoanInstallmentsData[x].totalPayment}</td>
                        <td style='text-align:right;'>${carLoanInstallmentsData[x].remainingBalance}</td>
                        <td style='text-align:right;'>${carLoanInstallmentsData[x].depreciationAmount}</td>
                        <td style='text-align:center;'>${status}</td>
                    </tr>
                    `);
                    
                    count++;
                }

            }

        },
        error: function (responseObject) {
        }
    });
    $('#car_loan_installments_modal').modal('show');
}

function onDepreciationsClicked(rowId) {

    $.ajax({
        url: '/api/Loans/GetCarLoanDepreciationInstallments?loanId=' + rowId,
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {

            if (responseObject.statusCode == 200) {
                carLoanInstallmentsData = responseObject.data;
                $('#car_loan_depreciation_installments_table tbody').empty();
                let count = 1;
                for (let x = 0; x < carLoanInstallmentsData.length; x++) {
                    let status = '';
                    if (carLoanInstallmentsData[x].isPaid) {
                        status = 'Paid';
                    }
                    else {
                        status = 'Unpaid';
                    }

                    $('#car_loan_depreciation_installments_table tbody').append(`
                    <tr>
                        <td style='text-align:center;'>${count}</td>
                        <td style='text-align:center;'>${carLoanInstallmentsData[x].monthId}</td>
                        <td style='text-align:right;'>${carLoanInstallmentsData[x].depreciationAmount}</td>
                        <td style='text-align:center;'>${status}</td>
                    </tr>
                    `);

                    count++;
                }

            }

        },
        error: function (responseObject) {
        }
    });
    $('#car_loan_depreciation_installments_modal').modal('show');
}


//function onEditConfirmed() {
//    let id = $('#Id_M').val();
//    let installmentAmount = $('#InstallmentAmount_M').val();
//    installmentAmount = installmentAmount == '' ? 0 : parseFloat(installmentAmount)
//    let isActive = $('#isactive_checkbox').is(':checked');
//    let isPaused = $('#pause_checkbox').is(':checked');

//    let dataObj = {
//        id: id,
//        installmentAmount: installmentAmount,
//        isActive: isActive,
//        isPaused: isPaused
//    }

//    $.ajax({
//        url: '/api/Loans/UpdateComLoan',
//        type: 'PUT',
//        async: false,
//        data: dataObj
//    }).always(function (responseObject) {
//        $('.error-item').empty();
//        if (responseObject.statusCode == 201) {
//            showToast(title = 'Success', message = responseObject.responseMessage, toastrType = 'success');
//            getComLoans();
//        }
//        if (responseObject.statusCode == 400) {
//            for (let error in responseObject.errors) {
//                $(`#${error}`).empty();
//                $(`#${error}`).append(responseObject.errors[error]);
//            }
//            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
//        }
//        if (responseObject.statusCode == 500) {
//            showToast(title = 'Error', message = responseObject.responseMessage, toastrType = 'error');
//        }
//    });


//}

function initialLoads() {
    $.ajax({
        url: '/api/Loans/GetEmployeesForCarLoan?employeeTypeId=1',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            employees = responseObject.data;
            $('#JobCode').empty();
            $('#JobCode').append(`<option value='0'>select one</option>`);
            $.each(employees, function (key, item) {
                $('#JobCode').append(`<option value=${item.id}>${item.jobCode}</option>`);
            });
        },
        error: function (responseObject) {
        }
    });
}

function getCarLoans() {
    var count = 0;

    if (_dataTable != undefined) {
        _dataTable.destroy();
    }


    _dataTable = $('#car_loan_list_table').DataTable({
        ajax: {
            url: '/api/Loans/GetCarLoans',
            dataSrc: 'data'
        },
        columns: [
            { data: 'sl' },
            {
                data: 'id',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-primary btn-sm" onclick="onEditClicked('${data}')">installments</button>`;
                }
            },
            {
                data: 'id',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-primary btn-sm" onclick="onDepreciationsClicked('${data}')">depreciations</button>`;
                }
            },
            { data: 'jobCode' },
            { data: 'employeeName' },
            { data: 'loanTakenDate' },
            { data: 'interestRate' },
            { data: 'totalLoanAmount' },
            { data: 'depreciationAmount' },
            { data: 'remainingDepreciationAmount' },
            { data: 'actualAmount' },
            { data: 'remainingActualAmount' },
            { data: 'installmentNo' },
            { data: 'remainingInstallmentNo' }
        ]
    });

}