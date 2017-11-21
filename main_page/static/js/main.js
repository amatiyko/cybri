"use strict";

//tooltip init
$('[data-toggle="tooltip"]').tooltip();


// Options
var dateFormat = 'YYYY-MM-DD';
var optionsDate = {
    autoclose: true,
    todayHighlight: true,
    format: dateFormat.toLowerCase(),
    immediateUpdates: true,
};

//validator
var $validator = $('.user-form'),
    $select = $('select:not([multiple])'),
    $multiselect = $('select[multiple]'),
    validatorSettings = {
        delay: 500,
        html: true,
        disable: false,
        focus: false,
        custom: {},
        errors: {
            match: 'Does not match',
            minlength: 'Not long enough'
        },
        feedback: {
            success: 'glyphicon-ok',
            error: 'glyphicon-remove'
        }
    };

function initValidator() {
    //init validator
    if ($validator.length) {

        $validator
            .validator(validatorSettings)
            .off('input.bs.validator change.bs.validator focusout.bs.validator');
    }
}
initValidator();

//init select
$select.each(function () {
    $(this).selectpicker({
        liveSearch: false,
        title: $(this).attr('placeholder'),
        style: 'btn-default'
    });
});

$multiselect.each(function () {
    var self = $(this);

    $(this).selectpicker({
        liveSearch: true,
        title: $(this).attr('placeholder'),
        style: 'btn-default',
        tickIcon: 'icon-ok',
        showTick: true,
        header: 'Please select: ' + $(this).attr('placeholder'),
        multipleSeparator: ' '
    });

    var $dropdown = $(this).parent().find(".dropdown-toggle");

    $dropdown.on('click', '.label .icon-cross', function () {
        var id = $(this).data('id');
        self.find('[value=' + id + ']').prop('selected', false);
        $multiselect.selectpicker('refresh');
    });

});


$(document).ready(function (e) {
    var hash = window.location.hash,
        text = hash.slice(1);

    console.log(hash);

    if ( hash.length == 0 ) {
        return true;
    }

    var isSelectUserType = false;

    $('#id_user_type input').each(function (i, item) {
       if ( $(this).val() === text ) {
           $(this).attr('checked', 'checked');
           isSelectUserType = true;
           window.location.hash = '';
           $(this).parents('li').addClass('active');
       }
    });

    if (isSelectUserType) {
        return true;
    }

    $validator.validator('destroy');

    var step = text.split('--')[0],
        userType = text.split('--')[1];

    //cheked radion btn with active prof
    $('#id_user_type li').each(function (i, item) {
        var $radio = $(this).find(':radio');

       if ($radio.val() == userType) {
           $(this).addClass('full-width active');
           return true;
       }

       $(this).addClass('hidden');

    });

    var $el = $(hash).addClass("fadeIn active").prev();

    while($el.length != 0 ) {
        $el = $el.addClass("fadeIn active").prev();
    }

    var activeStep = $('.step.active');

    for(var i=0; i<activeStep.length-1; i++) {
        $(activeStep[i]).find('.btn.btn-info').remove();
    }

    $(hash).parents('form').find('.spec-user-form').each(function (i, item) {
        if ($(this).attr('id') == userType) {
            return true;
        }
        $(this).remove();

    });

    initValidator();
});

$('#id_user_type li').click(function () {

    $(this).addClass('active').siblings().removeClass('active');

    var $form = $(this).parents('.step'),
        $nextBtn = $form.find('.start-step'),
        nextHref = $nextBtn.attr('href'),
        changePosition = nextHref.indexOf('--');

    if (changePosition == -1) {

        nextHref += '--' + $(this).find('input').val();
        $nextBtn.attr('href', nextHref);

        return true;
    }

    var trashHref = nextHref.slice(changePosition),
        link = '--' + $(this).find('input').val();

    nextHref = nextHref.replace( trashHref, link );

    $nextBtn.attr('href', nextHref);

});

// Form with step in complite profile
$('.step .btn-next').on('click', function (e) {
    e.preventDefault();

    var parentFieldset = $(this).parents('.step'),
        formGroup = parentFieldset.find('.form-group'),
        nextStep = true;

    nextStep = valideteForm(formGroup);

    if (nextStep) {
        clearForms();
        parentFieldset.next().addClass("fadeIn active");
        window.location.hash = $(this).attr('href');

        setTimeout(function ( link ) {
            scrollTo( link );
        }, 1, $(this).attr('href'));

        $validator.validator('destroy');
        $(this).remove();
    }
});

$('.step .start-step').on('click', function (e) {
    e.preventDefault();

    var parentFieldset = $(this).parents('.step'),
        formGroup = parentFieldset.find('.form-group'),
        nextStep = true;

    nextStep = valideteForm(formGroup, parentFieldset);

    if(nextStep) {
        clearForms();
        parentFieldset.next().find('.step').eq(0).addClass("fadeIn active");
        window.location.hash = $(this).attr('href');

        setTimeout(function ( link ) {
            scrollTo( link );
        }, 1, $(this).attr('href'));

        $(this).remove();
    }
});

//init validator in  past-experience
function pastExpValidate() {
    $('.formset-row').length >= 2 ? $('.delete-row').removeClass('hide') : $('.delete-row').addClass('hide');

    if ($('.formset-row').length) {
        var $experience = $('.past-experience input');
        $experience.each(function () {
            $(this).on('keyup change', function () {
                if ($(this).val().length > 0) {
                    $experience.prop('required', true);
                }
                else {
                    $experience.prop('required', false);
                }
            });
        });
    }
}

function valideteForm(formGroup, $formStep) {
    pastExpValidate();

    var $valid = $formStep || $validator;
    $valid.validator('validate');

    if (formGroup.hasClass('has-error')) {
        return false;
    }

    return true;
}

function clearForms() {
    $('#id_user_type li').each(function (i, item) {
        var $element = $(item);

        if( $element.hasClass('active') ) {

            $element.addClass('full-width');
            return true;
        }

        var el = $element.find('input').val();
        $('#' + el).remove();
        $element.addClass('hidden');
    });
}

function scrollTo(selector, t) {

    var $element = $(selector),
        time = t || 1000;

    $('html, body').animate({
            scrollTop: $element.offset().top - 50 },
        time);
}