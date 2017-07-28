currentScale = 1;
$(document).ready(function() {
    var viewModel = {
        mainColor: ko.observable(), // Positive value, so initially black
        isAddPageNumbersTop: ko.observable(false),
        isAddPageNumbersBottom: ko.observable(false)
    };
    ko.applyBindings(viewModel);
    
    $('.zoom-out').on('click', function() {
        if (currentScale > 0.2) {
            currentScale -= 0.1;
        }
        
        $('.word-page').css({
            '-webkit-transform' : 'scale(' + currentScale + ')',
            '-moz-transform'    : 'scale(' + currentScale + ')',
            '-ms-transform'     : 'scale(' + currentScale + ')',
            '-o-transform'      : 'scale(' + currentScale + ')',
            'transform'         : 'scale(' + currentScale + ')'
        });
    });

    $('.zoom-in').on('click', function() {
        if (currentScale < 1.0) {
            currentScale += 0.1;
        }
        
        $('.word-page').css({
            '-webkit-transform' : 'scale(' + currentScale + ')',
            '-moz-transform'    : 'scale(' + currentScale + ')',
            '-ms-transform'     : 'scale(' + currentScale + ')',
            '-o-transform'      : 'scale(' + currentScale + ')',
            'transform'         : 'scale(' + currentScale + ')'
        });
    });

    $('.portrait').on('click', function() {
        $('.word-page').css({'width' : '794px', 'height' : '1122.5px'});
    });

    $('.landscape').on('click', function() {
        $('.word-page').css({'height' : '794px', 'width' : '1122.5px'});
    });

    window.myColorPicker = $('.font_color').colorPicker({
        buildCallback: function($elm) {
            this.$colorPatch = $elm.prepend('<div class="cp-disp">').find('.cp-disp');
        },
        renderCallback: function($elm, toggled) {
            var colors = this.color.colors;

            this.$colorPatch.css({
                backgroundColor: '#' + colors.HEX,
                color: colors.RGBLuminance > 0.22 ? '#222' : '#ddd'
            }).text(this.color.toString($elm._colorMode));
            $elm.val( '#' + colors.HEX);
            viewModel.mainColor('#' + colors.HEX);
        }
    });

    $('#header .add_page_numbers').change(function() {
        viewModel.isAddPageNumbersTop($(this).prop('checked'))
    });
    $('#footer .add_page_numbers').change(function() {
        viewModel.isAddPageNumbersBottom($(this).prop('checked'))
    });

    $( ".word-page header > div:eq(0) > span" ).draggable({ containment: ".word-page header > div:eq(0)", scroll: false });
    $( ".word-page header > div:eq(1) > span, .word-page header > div:eq(1) > img, .word-page header > div:eq(1) > .badge" ).draggable({
        containment: ".word-page header > div:eq(1)",
        scroll: false
    });

    $( ".word-page footer > div:eq(1) > span" ).draggable({ containment: ".word-page footer > div:eq(1)", scroll: false });
    $( ".word-page footer > div:eq(0) > span, .word-page footer > div:eq(0) > img, .word-page footer > div:eq(0) > .badge" ).draggable({
        containment: ".word-page footer > div:eq(0)",
        scroll: false
    });

    $('.badge').draggable({
        helper: "clone",
        revert: 'invalid',
        zIndex: 999999,
        grid: [ 5, 5 ]
    });

    $( ".word-page header > div:eq(1)" ).droppable({
        drop: function( event, ui ) {
            if ($(ui.helper[0]).hasClass('header-badge') && !$(ui.helper[0]).hasClass('cloned')) {
                var el = $(ui.helper[0]).clone();
                el.addClass('cloned');
                el.removeAttr("style");
                var remove = "<span class='glyphicon glyphicon-remove remove-badge'></span>";
                el.append(remove);
                $( ".word-page header > div:eq(1)" ).append(el);
                $( ".word-page header > div:eq(1) > .badge" ).draggable({
                    containment: ".word-page header > div:eq(1)",
                    scroll: false,
                    grid: [ 5, 5 ]
                });
            }
        }
    });

    $( ".word-page footer > div:eq(0)" ).droppable({
        drop: function( event, ui ) {
            if ($(ui.helper[0]).hasClass('footer-badge') && !$(ui.helper[0]).hasClass('cloned')) {
                var el = $(ui.helper[0]).clone();
                el.addClass('cloned');
                el.removeAttr("style");
                var remove = "<span class='glyphicon glyphicon-remove remove-badge'></span>";
                el.append(remove);
                $( ".word-page footer > div:eq(0)" ).append(el);
                $( ".word-page footer > div:eq(0) > .badge" ).draggable({
                    containment: ".word-page footer > div:eq(0)",
                    scroll: false,
                    grid: [ 5, 5 ]
                });
            }
        }
    });


    $( "#bodyPage table tbody tr > td" ).droppable({
        drop: function( event, ui ) {
            if ($(ui.helper[0]).hasClass('body-badge') && !$(ui.helper[0]).hasClass('cloned')) {
                var el = $(ui.helper[0]).clone();
                el.addClass('cloned');
                el.removeAttr("style");
                var remove = "<span class='glyphicon glyphicon-remove remove-badge'></span>";
                var text = '<<' + el.text() + '>>';
                el.text(text);
                el.append(remove);
                $(this).append(el);
            }
        }
    });

    $(".word-page header > div:eq(1)").resizable({
        maxHeight: 360,
        minHeight: 160,
        maxWidth: $(".word-page header").width(),
        minWidth: $(".word-page header").width(),
    });

    $('.word-page').delegate('.remove-badge', 'click', function() {
        $(this).parent().remove();
    });

    $(".word-page footer > div:eq(0)").resizable({
        maxHeight: 260,
        minHeight: 160,
        maxWidth: $(".word-page footer").width(),
        minWidth: $(".word-page footer").width(),
        handles: "n"
    });

    // var instance = Split(['#headerPage', '#bodyPage', '#footerPage'], {
    //     direction: 'vertical',
    //     // minSize: [160, 802.5, 160],
    //     sizes: [23, 60, 17],
    //     gutterSize: 1
    // });

    $("table").resizableColumns({
        store: window.store
    });

    $.fn.editable.defaults.mode = 'popup';

    editLink();

    $('#bodyPage table tfoot').delegate('.add-row', 'click', function() {
        var str = '<tr>' +
                  '<th colspan="1"><span class="glyphicon glyphicon-minus remove-item"></span></th>' +
                  '<th colspan="1"><a href="#">Item</a></th>' +
                  '<td colspan="2"></td>' +
                  '</tr>';

        $(this).closest('tfoot').append(str);
        editLink();
    });

    function editLink() {
        $('#bodyPage table a').editable({
            type: 'text',
            title: 'Enter column name',
            success: function(response, newValue) {
                // console.log(newValue);
            }
        });

        $( "#bodyPage table tbody tr > td, #bodyPage table tfoot tr > td" ).droppable({
            drop: function( event, ui ) {
                if ($(ui.helper[0]).hasClass('body-badge') && !$(ui.helper[0]).hasClass('cloned')) {
                    var el = $(ui.helper[0]).clone();
                    el.addClass('cloned');
                    el.removeAttr("style");
                    var remove = "<span class='glyphicon glyphicon-remove remove-badge'></span>";
                    var text = '<<' + el.text() + '>>';
                    el.text(text);
                    el.append(remove);
                    $(this).append(el);
                }
            }
        });

        $('#bodyPage table tfoot').delegate('.remove-item', 'click', function() {
            $(this).parent().parent().remove();
        });
    }

    $(".square").resizable({
        handles: 's'
    });
});