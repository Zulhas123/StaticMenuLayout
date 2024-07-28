$(document).ready(function () {
    $(function () {
        var current = window.location.pathname + window.location.search;
        $('#sidebar-menu ul li.submenu a').each(function () {
            var $this = $(this);
            // if the current path is equal to this link, add class menu-active
            if ($this.attr('href') === current) {
                $this.addClass('active');
                $this.parent().parent().slideToggle("slow");
            }
        })
    });
});

function showToast(title, message, toastrType) {
    toastr[toastrType](message, title)

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
}