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
let dragItem = null;
let whiteboard = $(".outer-board");
let isDraging = false;

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

whiteboard.on("touchstart", dragStart);
whiteboard.on("mousedown", dragStart);

whiteboard.on("touchend", dragEnd);
whiteboard.on("mouseup", dragEnd);

whiteboard.on("touchmove", dragMove);
whiteboard.on("mousemove", dragMove);

function addMagnet(e) {
    if (e.type == "touchstart") {
        e.preventDefault();
    }
    let tstmp = new Date().getTime();
    let rn = Math.floor(Math.random() * Math.floor(10));
    let id = `m${tstmp}n${rn}`;
    $(".inner-board").append(`<span class="magnet red" draggable="false" data-mid="${id}"></span>`);
    $(".magnet-list").append(`<p class="magnet-info" data-mid="${id}">${id}</p>`)
}

function addMagnetDefaut(e) {
    let nine_pos = [[50, 65], [50, 87], [65, 58], [57, 51], [35, 58], [43, 51], [22, 38], [50, 28], [78, 38]];

    if (e.type == "touchstart") {
        e.preventDefault();
    }

    for (let i = 0; i < 9; i++) {
        let tstmp = new Date().getTime();
        let rn = i + 1;
        let id = `m${tstmp}n${rn}`;
        $(".inner-board").append(`<span class="magnet red" draggable="false" data-mid="${id}"></span>`);
        $(".magnet-list").append(`<p class="magnet-info" data-mid="${id}">${id}</p>`);
        $(`.magnet[data-mid="${id}"]`).css({ "left": nine_pos[i][0] + "%", "top": nine_pos[i][1] + "%" });
    }
}

function clearMagnet(e) {    
    if (e.type == "touchstart") {
        e.preventDefault();
    }
    $(".inner-board").html("");
    $(".magnet-list").html("");
}

function handlerInOut(e) {
    mid = $(this).attr("data-mid");
    $(`.magnet[data-mid="${mid}"]`).toggleClass("highlight");
    $(`.magnet-list p[data-mid="${mid}"]`).toggleClass("highlight");
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

    mid = $(this).attr("data-mid");
    $(`.magnet[data-mid="${mid}"]`).toggleClass("highlight");
    $(`.magnet-list p[data-mid="${mid}"]`).toggleClass("highlight");
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
        console.log("touchMove!!" + x + ", " + y);
    }
    else {
        x = e.pageX;
        y = e.pageY;
        console.log("mouseMove!!" + x + ", " + y);
    }
    x /= $(".inner-board").width();
    y /= $(".inner-board").width();
    dragItem.css({ "left": x * 100 + "%", "top": y * 100 + "%" });
}

$(window).resize();