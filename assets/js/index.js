
let dragItem = null;
let whiteboard = $(".inner-board");
let isDraging = false;

$(window).resize(function () {
    let inner_w = $(this).width();
    let inner_h = $(this).height();
    if (inner_w <= inner_h) {
        $(".outer-board > div").addClass("flex-column");
    }
    else {
        $(".outer-board > div").removeClass("flex-column");
    }
});

$(".magnet-list").on("input", ".magnet-info input", function () {
    let mid = $(this).parent(".magnet-info").data("mid");
    $(`.magnet[data-mid="${mid}"] a`).text($(this).val());
});

$("button[name='button-add']").on("click", addMagnet);
$("button[name='button-add']").on("touchstart", addMagnet);

$("button[name='button-add-default']").on("click", addMagnetDefaut);
$("button[name='button-add-default']").on("touchstart", addMagnetDefaut);

$("button[name='button-clear']").on("click", clearMagnet);
$("button[name='button-clear']").on("touchstart", clearMagnet);

$(".inner-board").on("touchstart", ".magnet", magnetChoose);
$(".inner-board").on("mousedown", ".magnet", magnetChoose);

$(".inner-board").on("mouseenter mouseleave", ".magnet", handlerInOut);
$(".magnet-list").on("mouseenter mouseleave", "p", handlerInOut);

$(".magnet-list").on("click", ".magnet-info button", changeMagnetColor);
$(".magnet-list").on("touchstart", ".magnet-info button", changeMagnetColor);

whiteboard.on("touchstart", dragStart);
whiteboard.on("mousedown", dragStart);

whiteboard.on("touchend", dragEnd);
whiteboard.on("mouseup", dragEnd);

whiteboard.on("touchmove", dragMove);
whiteboard.on("mousemove", dragMove);

function appendMagnetDom(mid, color = "red") {
    let magnet_dom = `<div class="magnet ${color}" draggable="false" data-mid="${mid}"><a></a></div>`;
    let list_dom = `
    <p class="magnet-info ${color}" data-mid="${mid}">
    <button name="red" style="background-color: red;"></button>
    <button name="yellow" style="background-color: yellow;"></button>
    <button name="blue" style="background-color: blue;"></button>
    <input type="text" name="name">

    </p>`;
    $(".inner-board").append(magnet_dom);
    $(".magnet-list").append(list_dom);
}

function addMagnet(e) {
    if (e.type == "touchstart") {
        e.preventDefault();
    }
    let tstmp = new Date().getTime();
    let rn = Math.floor(Math.random() * Math.floor(10));
    let mid = `m${tstmp}n${rn}`;
    appendMagnetDom(mid);
}

function addMagnetDefaut(e) {
    let nine_pos = [[50, 65], [50, 87], [65, 58], [57, 51], [35, 58], [43, 51], [22, 38], [50, 28], [78, 38]];

    if (e.type == "touchstart") {
        e.preventDefault();
    }

    for (let i = 0; i < 9; i++) {
        let tstmp = new Date().getTime();
        let rn = i + 1;
        let mid = `m${tstmp}n${rn}`;
        appendMagnetDom(mid);
        $(`.magnet[data-mid="${mid}"]`).css({ "left": nine_pos[i][0] + "%", "top": nine_pos[i][1] + "%" });
    }
}

function clearMagnet(e) {
    if (e.type == "touchstart") {
        e.preventDefault();
    }
    $(".inner-board").html("");
    $(".magnet-list").html("");
}

function changeMagnetColor(e) {
    if (e.type == "touchstart") {
        e.preventDefault();
    }

    let mid = $(this).parent(".magnet-info").data("mid");
    $(`[data-mid="${mid}"]`).removeClass("red");
    $(`[data-mid="${mid}"]`).removeClass("yellow");
    $(`[data-mid="${mid}"]`).removeClass("blue");

    switch ($(this).attr("name")) {
        case "red":
            $(`[data-mid="${mid}"]`).addClass("red");
            break;
        case "yellow":
            $(`[data-mid="${mid}"]`).addClass("yellow");
            break;
        case "blue":
            $(`[data-mid="${mid}"]`).addClass("blue");
            break;

        default:
            break;
    }
}

function handlerInOut(e) {
    mid = $(this).data("mid");
    $(`[data-mid="${mid}"]`).toggleClass("highlight");
}

function magnetChoose(e) {
    if (e.type == "touchstart") {
        e.preventDefault();
    }
    else {
    }
    isDraging = true;
    dragItem = $(this);
    $(".highlight").removeClass("highlight");

    mid = $(this).data("mid");
    $(`[data-mid="${mid}"]`).toggleClass("highlight");
    console.log($(`.magnet-info[data-mid="${mid}"]`).position().top);
    $(".magnet-list-box").animate(
        {
            scrollTop: $(`.magnet-info[data-mid="${mid}"]`).position().top
        },
        500
    );
}

function dragStart(e) {
    if (e.type == "touchstart") {
        e.preventDefault();
    }
    else {
    }
    isDraging = true;
}

function dragEnd(e) {
    e.preventDefault();
    isDraging = false;
    dragItem = null;
}

function dragMove(e) {
    if (!isDraging || dragItem == null) return;
    let x = 0;
    let y = 0;
    if (e.type == "touchmove") {
        e.preventDefault();
        let touch = e.originalEvent.targetTouches[0];
        x = touch.pageX;
        y = touch.pageY;
        //console.log("touchMove!!" + x + ", " + y);
    }
    else {
        x = e.pageX;
        y = e.pageY;
        //console.log("mouseMove!!" + x + ", " + y);
    }
    x /= $(".inner-board").width();
    y /= $(".inner-board").width();
    dragItem.css({ "left": x * 100 + "%", "top": y * 100 + "%" });
}

$(window).resize();