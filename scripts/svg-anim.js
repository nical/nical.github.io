window.addEventListener("load", function(){

    console.log("Loading SVG animations");

    var items = document.getElementsByClassName("svg-anim");

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

        item.svg_frames = [];
        for (i = 0; i < num_frames; i++) {
            // Load each frame into an image element.
            var img = document.createElement("img");
            img.src = src + "-" + i + ".svg";

            item.svg_frames.push(img);
        }

        make_anim_viewer(src, num_frames, item);
    }
});

function make_anim_viewer(name, num_frames, parent_container) {
    var frames = parent_container.svg_frames;
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

    let play_symbol = "&#x23f5;";
    let pause_symbol = "&#x23f8;";
    var play_button = document.createElement("button");
    play_button.classList.add("anim-play");
    play_button.innerHTML = play_symbol;
    parent_container.playing = false;
    play_button.onclick = function() {
        parent_container.playing = !parent_container.playing;
        if (parent_container.playing) {
            play_button.innerHTML = pause_symbol;
        } else {
            play_button.innerHTML = play_symbol;
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
    prev_button.innerHTML = "&#129092;";
    prev_button.onclick = function() {
        if (timeline.value > 0) {
            parent_container.playing = false;
            timeline.value = parseInt(timeline.value) - 1;
            update_frame();
        }
    };

    var next_button = document.createElement("button");
    next_button.innerHTML = "&#129094;";
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
