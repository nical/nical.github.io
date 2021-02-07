window.addEventListener("load", function(){

    console.log("Loading SVG animations");

    var items = document.getElementsByClassName("anim-player");

    for (item of items) {
        var src = item.getAttribute("file_name");
        var num_frames = parseInt(item.getAttribute("frames"));
        var playback_speed = parseFloat(item.getAttribute("playback-speed"));
        if (isNaN(playback_speed)) {
            playback_speed = 1;
        }

        item.playback_speed = playback_speed;

        console.log("playback speed ", playback_speed)

        console.log(" - Animated SVG: " + src + " frames: " + num_frames);

        item.anim_frames = [];
        for (i = 0; i < num_frames; i++) {
            // Load each frame into an image element.
            var img = document.createElement("img");
            img.src = src.replace("$", i);

            item.anim_frames.push(img);
        }

        make_anim_viewer(src, num_frames, item);
    }
});

function make_anim_viewer(name, num_frames, parent_container) {
    var frames = parent_container.anim_frames;
    console.log("creating viewer, ", frames.length, " frames /", num_frames);

    var frame_container = document.createElement("div");
    frame_container.classList.add("frame-container");

    // Dummy element that will be replaced the first time update_frame is called.
    var dummy = document.createElement("div");
    dummy.classList.add("dummy");
    frame_container.appendChild(dummy);

    var controls = document.createElement("div");
    controls.classList.add("anim-controls");

    var timeline = document.createElement("input");
    timeline.classList.add("anim-timeline");
    timeline.setAttribute("type", "range");
    timeline.setAttribute("min", 0);
    timeline.setAttribute("value", 0);
    timeline.setAttribute("max", num_frames - 1);
    timeline.setAttribute("step", 1);
    timeline.setAttribute("label", "Step");

    var text = document.createElement("div");
    text.classList.add("anim-text");

    function update_frame() {
        console.log(name, " timeline seek to frame ", timeline.value, "/", frames.length - 1);
        var frame = frames[timeline.value];
        frame_container.firstChild.replaceWith(frame);
        text.innerHTML = (parseInt(timeline.value) + 1) +  "/" + num_frames;
    }

    timeline.oninput = update_frame;

    let play_icon = make_play_icon();
    let pause_icon = make_pause_icon();

    var play_button = document.createElement("button");
    play_button.classList.add("anim-control-button");
    play_button.classList.add("anim-control-left");
    play_button.classList.add("anim-control-right");
    play_button.classList.add("anim-play");
    play_button.appendChild(play_icon);
    parent_container.playing = false;
    play_button.onclick = function() {
        parent_container.playing = !parent_container.playing;
        if (parent_container.playing) {
            play_button.firstChild.replaceWith(pause_icon);
        } else {
            play_button.firstChild.replaceWith(play_icon);
        }


        function play() {
            if (!parent_container.playing) {
                return;
            }
            timeline.value = (parseInt(timeline.value) + 1) % num_frames;
            update_frame();
            window.setTimeout(play, 1000 / parent_container.playback_speed);
        }

        play();
    };


    var prev_button = document.createElement("button");
    prev_button.classList.add("anim-control-button");
    prev_button.classList.add("anim-control-left");
    prev_button.appendChild(make_prev_icon());
    prev_button.onclick = function() {
        if (timeline.value > 0) {
            parent_container.playing = false;
            timeline.value = parseInt(timeline.value) - 1;
            update_frame();
        }
    };

    var next_button = document.createElement("button");
    next_button.appendChild(make_next_icon());
    next_button.classList.add("anim-control-button");
    next_button.classList.add("anim-control-right");
    next_button.onclick = function() {
        if (timeline.value < num_frames - 1) {
            parent_container.playing = false;
            timeline.value = parseInt(timeline.value) + 1;
            update_frame();
        }
    };

    controls.appendChild(prev_button);
    controls.appendChild(next_button);
    controls.appendChild(play_button);
    controls.appendChild(timeline);
    controls.appendChild(text);

    parent_container.appendChild(frame_container);
    parent_container.appendChild(controls);

    update_frame();

    parent_container.timeline = timeline;
}

function svg_element_from_text(src) {
    var element = document.createElement("svg");
    element.innerHTML = src;
    return element;

}

function make_play_icon() {
    return svg_element_from_text(
        '<svg style="width:24px;height:24px" viewBox="0 0 24 24"> <path fill="black" d="M8,5.14V19.14L19,12.14L8,5.14Z" /> </svg>'
    );
}

function make_pause_icon() {
    return svg_element_from_text(
        '<svg style="width:24px;height:24px" viewBox="0 0 24 24"> <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" /> </svg>'
    );
}

function make_next_icon() {
    return svg_element_from_text(
        '<svg style="width:24px;height:24px" viewBox="0 0 24 24"> <path fill="currentColor" d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" /> </svg>'
    );
}

function make_prev_icon() {
    return svg_element_from_text(
        '<svg style="width:24px;height:24px" viewBox="0 0 24 24"> <path fill="currentColor" d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" /> </svg>'
    );
}
