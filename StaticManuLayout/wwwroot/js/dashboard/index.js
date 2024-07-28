$(document).ready(function () {

    getDesignationInfo();
    getDepartmentInfo();
    getBankTagInfo();
    getBankInfo();
    getLocationInfo();
    getGradeInfo();

});

function getDesignationInfo() {
    $.ajax({
        url: '/api/Designations/GetDesignations',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            $('#designation_count').empty();
            $('#designation_count').append(responseObject.data.length);
        },
        error: function (responseObject) {
        }
    });
}

function getDepartmentInfo() {
    $.ajax({
        url: '/api/Departments/GetDepartments',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            $('#department_count').empty();
            $('#department_count').append(responseObject.data.length);
        },
        error: function (responseObject) {
        }
    });
}

function getBankTagInfo() {
    $.ajax({
        url: '/api/Banks/GetBankTags',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            $('#bank_tag_count').empty();
            $('#bank_tag_count').append(responseObject.data.length);
        },
        error: function (responseObject) {
        }
    });
}

function getBankInfo() {
    $.ajax({
        url: '/api/Banks/GetBanks',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            $('#bank_count').empty();
            $('#bank_count').append(responseObject.data.length);
        },
        error: function (responseObject) {
        }
    });
}

function getLocationInfo() {
    $.ajax({
        url: '/api/Locations/GetLocations',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            $('#location_count').empty();
            $('#location_count').append(responseObject.data.length);
        },
        error: function (responseObject) {
        }
    });
}

function getGradeInfo() {
    $.ajax({
        url: '/api/Grades/GetGrades',
        type: 'Get',
        async: false,
        dataType: 'json',
        success: function (responseObject) {
            $('#grade_count').empty();
            $('#grade_count').append(responseObject.data.length);
        },
        error: function (responseObject) {
        }
    });
}
