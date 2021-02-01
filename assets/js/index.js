
let dragItem = null;
let whiteboard = $(".inner-board");
let isDraging = false;
let recorder = {};


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

$(".magnet-list").on("input", ".magnet-info input[name='name']", function () {
    let mid = $(this).parent(".magnet-info").data("mid");
    $(`.magnet[data-mid="${mid}"] a`).text($(this).val());
});

$("button[name='button-add']").on("click", addMagnet);
$("button[name='button-add-default']").on("click", addMagnetDefaut);
$("button[name='button-clear']").on("click", clearMagnet);
$("button[name='button-save']").on("click", saveData);
$("button[name='button-load']").on("click", loadData);
$("button[name='button-set']").on("click", setRecord);
$("button[name='button-play']").on("click", playRecord);
$("button[name='button-reset']").on("click", resetRecord);

$(".inner-board").on("touchstart", ".magnet", magnetChoose);
$(".inner-board").on("mousedown", ".magnet", magnetChoose);

$(".inner-board").on("mouseenter mouseleave", ".magnet", handlerInOut);
$(".magnet-list").on("mouseenter mouseleave", "p", handlerInOut);

$(".magnet-list").on("click", ".magnet-info button", changeMagnetColor);
$(".magnet-list").on("touchstart", ".magnet-info input[name='speed']", handlerSpeed);
$(".magnet-list").on("touchmove", ".magnet-info input[name='speed']", handlerSpeed);

whiteboard.on("touchstart", dragStart);
whiteboard.on("mousedown", dragStart);

whiteboard.on("touchend", dragEnd);
whiteboard.on("mouseup", dragEnd);

whiteboard.on("touchmove", dragMove);
whiteboard.on("mousemove", dragMove);

function appendMagnetTemplate(mid, color = "red", text = "", speed = 50) {
    let magnet_template = `<div class="magnet ${color}" draggable="false" data-mid="${mid}" style="left: 5%; top: 90%;"><a>${text}</a></div>`;
    let list_template = `
    <p class="magnet-info ${color}" data-mid="${mid}">
        <button name="red" style="background-color: red;"></button>
        <button name="yellow" style="background-color: yellow;"></button>
        <button name="blue" style="background-color: blue;"></button>
        <input type="range" min="10" max="90" step="5" value="${speed}" name="speed" id="speed">
    <input type="text" class="form-control mt-1" name="name" placeholder="name" value="${text}">

    </p>`;
    $(".inner-board").append(magnet_template);
    $(".magnet-list").append(list_template);
}

function addMagnet(e) {
    let tstmp = new Date().getTime();
    let rn = Math.floor(Math.random() * Math.floor(10));
    let mid = `m${tstmp}n${rn}`;
    appendMagnetTemplate(mid);
    setRecord();
}

function addMagnetDefaut(e) {
    let nine_pos = [[50, 65], [50, 87], [65, 58], [57, 51], [35, 58], [43, 51], [22, 38], [50, 28], [78, 38]];
    clearMagnet();
    for (let i = 0; i < 9; i++) {
        let tstmp = new Date().getTime();
        let rn = i + 1;
        let mid = `m${tstmp}n${rn}`;
        appendMagnetTemplate(mid, "red", rn);
        $(`.magnet[data-mid="${mid}"]`).css({ "left": nine_pos[i][0] + "%", "top": nine_pos[i][1] + "%" });
    }
    {
        let tstmp = new Date().getTime() + 1;
        let rn = 0;
        let mid = `m${tstmp}n${rn}`;
        appendMagnetTemplate(mid, "blue", "打者", 25);
        $(`.magnet[data-mid="${mid}"]`).css({ "left": 45 + "%", "top": 82 + "%" });
    }
    {
        let tstmp = new Date().getTime() + 1;
        let rn = 1;
        let mid = `m${tstmp}n${rn}`;
        appendMagnetTemplate(mid, "yellow", "球", 75);
        $(`.magnet[data-mid="${mid}"]`).css({ "left": 50 + "%", "top": 82 + "%" });
    }
    setRecord();
}

function setRecord(e) {
    recorder = {};
    recorder['orig'] = snapData();
    recorder['plays'] = {};
}

function resetRecord(e) {
    load(recorder['orig']);
    setRecord();
}

function clearMagnet(e) {
    $(".magnet").remove();
    $(".magnet-list").html("");
}

function changeMagnetColor(e) {
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

    recorder['orig'][mid]['color'] = $(this).attr("name");
}

function handlerInOut(e) {
    mid = $(this).data("mid");
    if(!$(this).hasClass("highlight")) {
        $(".highlight").removeClass("highlight");
    }
    $(`[data-mid="${mid}"]`).toggleClass("highlight");
}

function handlerSpeed(e) {
    let mid = $(this).parent(".magnet-info").data("mid");
    recorder['orig'][mid]['speed'] = $(this).val();
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

    $(".magnet-list-box").animate(
        {
            scrollTop: $(`.magnet-info[data-mid="${mid}"]`).position().top
        },
        500
    );

    if (!(mid in recorder['plays'])) {
        recorder['plays'][mid] = [dragItem.position()];
    }
}

function dragStart(e) {
    if (e.type == "touchstart") {
        e.preventDefault();
    }
    else {
    }
    $("input").blur();
    isDraging = true;
}

function dragEnd(e) {
    e.preventDefault();
    if (!isDraging || dragItem == null) return;
    let mid = dragItem.data("mid");
    if ($("#trash").hasClass("highlight")) {
        $(`[data-mid="${mid}"]`).remove();
        $("#trash").removeClass("highlight");
    }
    else {
        recorder['plays'][mid].push(dragItem.position());
    }
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
    if (x > 0.9 && y > 0.9) {
        $("#trash").addClass("highlight");
    }
    else {
        $("#trash").removeClass("highlight");
    }
}

function playRecord() {
    load(recorder['orig']);
    for (mid in recorder['plays']) {
        if (mid == undefined) continue;

        let pos_array = recorder['plays'][mid];
        for (let i = 0; i < pos_array.length - 1; i++) {
            addAnim(mid, pos_array[i], pos_array[i + 1]);
        }
    }
}

function addAnim(mid, start_pos, end_pos, easing = "linear") {
    let delta_x = (start_pos['left'] - end_pos['left']) / $(".inner-board").width();
    let delta_y = (start_pos['top'] - end_pos['top']) / $(".inner-board").width();
    let delta = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
    let speed = 100 - $(`.magnet-info[data-mid="${mid}"] input[name='speed']`).val();
    $(`.magnet[data-mid="${mid}"]`).velocity({ left: end_pos['left'], top: end_pos['top'] }, { duration: delta * speed * 80, easing: easing });
}

function snapData() {
    let save_data = {};
    $(".magnet").each(function () {
        let data = {};
        let mid = $(this).data("mid");
        let name = $(`.magnet-info[data-mid="${mid}"] input[name='name']`).val();
        data["name"] = name;
        let speed = $(`.magnet-info[data-mid="${mid}"] input[name='speed']`).val();
        data["speed"] = speed;
        let x = $(this).position().left / $(".inner-board").width();
        let y = $(this).position().top / $(".inner-board").width();
        data["pos"] = [x, y];
        if ($(this).hasClass("blue")) {
            data["color"] = "blue";
        }
        else if ($(this).hasClass("yellow")) {
            data["color"] = "yellow";
        }
        else {
            data["color"] = "red";
        }

        save_data[mid] = data;
    });
    console.log(save_data);
    return save_data;
}

function saveData(e) {
    let save_data = snapData();
    localStorage.setItem("data", JSON.stringify(save_data));
    localStorage.setItem("recorder", JSON.stringify(recorder));
}

function load(load_data) {
    clearMagnet();
    if (load_data == undefined || load_data.length <= 0) {
        addMagnetDefaut();
    }
    else {
        for (mid in load_data) {
            if (mid == undefined) continue;
            let data = load_data[mid];
            appendMagnetTemplate(mid, data["color"], data["name"], data["speed"]);
            $(`.magnet[data-mid="${mid}"]`).css({ "left": data["pos"][0] * 100 + "%", "top": data["pos"][1] * 100 + "%" });
        }
    }
}

function loadData(e) {
    const load_data = JSON.parse(localStorage.getItem("data"));
    const load_recorder = JSON.parse(localStorage.getItem("recorder"));
    recorder = load_recorder;
    load(load_data);
}

$(window).resize();
loadData();
if(recorder == null) {
    recorder = {};
    resetRecord();
}