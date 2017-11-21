"use strict";
if ($('.formset-row').length) {
    $('.formset-row').formset({
        addText: 'Add experience',
        deleteText: 'Remove this position',
        prefix: 'past-experience-set',
        addCssClass: 'btn btn-info btn-sm add-row pull-left mbs',
        deleteCssClass: 'delete-row pull-right mrs mbs',
        formCssClass: 'dynamic-form',
        added: function () {
            dateInit();
            $validator.validator('destroy');
            pastExpValidate();
            $validator.validator('validate');

        },
        removed: function () {
            pastExpValidate();
        }
    });
}


function dateInit() {

//Data time
    $(".start-date input").datepicker(
        optionsDate
    ).on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        $('.end-date input').datepicker('setStartDate', startDate);
    }).on('clearDate', function (selected) {
        $('.end-date input').datepicker('setStartDate', null);
    })


    $(".end-date input").datepicker(
        optionsDate
    ).on('changeDate', function (selected) {
        var endDate = new Date(selected.date.valueOf());
        $('.start-date input').datepicker('setEndDate', endDate);
    }).on('clearDate', function (selected) {
        $('.start-date input').datepicker('setEndDate', null);
    });

    $('.add-row').on('click', function () {
        $('.date-time input').datepicker('update');
    })


    $(".date-time input").each(function () {
        if ($(this).val()) {
            var d = moment(new Date($(this).val())).format(dateFormat);
            $(this).datepicker("update", d)
        }
    });

}

dateInit();