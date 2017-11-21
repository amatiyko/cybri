"use strict";

$(function () {

    // We can attach the `fileselect` event to all file inputs on the page
    $(document).on('change', ':file', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, ''),
            fileType = input.parent().data('valid'),
            validFileExtensions;

        switch (fileType) {
            case 'img':
                validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
                break;
            case 'cv':
                validFileExtensions = [".pdf"];
                break;
            default:
                validFileExtensions = [];
                break;
        }

        input.trigger('fileselect', [numFiles, label, validFileExtensions, fileType]);
    });


    // We can watch for our custom `fileselect` event like this
    $(':file').on('fileselect', function (event, numFiles, label, validFileExtensions, fileType) {
        var input = $(this).parents('.input-group').find(':text');

        if (fileType == 'img') {
            /* SCRIPT TO OPEN THE MODAL WITH THE PREVIEW */
            if (input.length && ValidateSingleInput(this, validFileExtensions) && this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $("#image").attr("src", e.target.result);
                    $("#modalCrop").modal("show");
                };
                reader.readAsDataURL(this.files[0]);
            }
        }

        if (fileType == 'cv') {

            if (ValidateSingleInput(this, validFileExtensions) && this.files && this.files[0]) {
                input.val(label);
            }
        }

    });


    /* SCRIPTS TO HANDLE THE CROPPER BOX */
    var $image = $("#image");
    var cropBoxData;
    var canvasData;
    var options = {
        viewMode: 1,
        aspectRatio: 1 / 1,
        minCropBoxWidth: 200,
        minCropBoxHeight: 200,
        responsive: true,
        preview: '.img-preview',
        ready: function () {
            $image.cropper("setCanvasData", canvasData);
            $image.cropper("setCropBoxData", cropBoxData);
        }
    };


    $("#modalCrop").on("shown.bs.modal", function () {
        $image.cropper(options);
    }).on("hidden.bs.modal", function () {
        cropBoxData = $image.cropper("getCropBoxData");
        canvasData = $image.cropper("getCanvasData");
        console.log(cropBoxData)
        $image.cropper("destroy");
    });


    $(".js-zoom-in").click(function () {
        $image.cropper("zoom", 0.1);
    });
    $(".js-zoom-out").click(function () {
        $image.cropper("zoom", -0.1);
    });


    /* SCRIPT TO COLLECT THE DATA AND POST TO THE SERVER */
    $(".js-crop-and-upload").click(function () {
        var cropData = $image.cropper("getData");
        var result = $image.cropper("getCroppedCanvas", {width: 200, height: 200})

        $("#id_x").val(cropData["x"]);
        $("#id_y").val(cropData["y"]);
        $("#id_height").val(cropData["height"]);
        $("#id_width").val(cropData["width"]);
        $("#modalCrop").modal("hide");
        result ? $('.avatar').attr('src', result.toDataURL('image/jpeg')) : '';
    });


    function ValidateSingleInput(oInput, validFile) {
        if (oInput.type == "file") {
            var sFileName = oInput.value.replace(/\\/g, '/').replace(/.*\//, '');
            if (sFileName.length > 0) {
                var blnValid = false,
                    filesize = oInput.files[0].size;

                for (var j = 0; j < validFile.length; j++) {
                    var sCurExtension = validFile[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }

                if (!blnValid) {
                    $.notify("Sorry, " + sFileName + " is invalid, allowed extensions are: " + validFile.join(", "));
                    oInput.value = "";
                    return false;
                }
            }
        }
        return true;
    }
});



