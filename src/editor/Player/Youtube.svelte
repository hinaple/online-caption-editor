<script context="module">
    let YouTubeIframeAPIReady = false;
</script>

<script>
    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    export let videoId = '';
    export let id = "player_" + (Math.random() * 100000);
    export let options = {};
    export let player;

    let height = "100%";
    let width = "100%";

    onMount(() => {
        let ytTagUrl = "https://www.youtube.com/iframe_api";

        if (!isMyScriptLoaded(ytTagUrl)) {
            var tag = document.createElement("script");
            tag.src = ytTagUrl;
            var firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        window.onYouTubeIframeAPIReady = () => {
            window.dispatchEvent(new Event("YouTubeIframeAPIReady"));
        };
        window.addEventListener("YouTubeIframeAPIReady", function() {
            if (YouTubeIframeAPIReady == false) {
                // first load of an YT Video on this project
                YouTubeIframeAPIReady = true; // now the Player can be created
                createPlayer(videoId);
            }
        });
        function createPlayer(vidId) {
            player = new YT.Player(id, {
                height,
                width,
                videoId: vidId,
                events: {
                    onReady: () => dispatch("ready"),
                    onStateChange: evt => dispatch("stateChange", evt.data)
                },
                playerVars: options,
            });
        }
        if (YouTubeIframeAPIReady) {
            createPlayer(videoId); // if the YT Script is ready, we can create our player
        }
    });
    function isMyScriptLoaded(url = "") {
        var scripts = document.getElementsByTagName("script");
        for (var i = scripts.length; i--; ) {
            if (scripts[i].src == url) return true;
        }
        return false;
    }
</script>
  
<div class="yt-vid">
    <div id={id} />
</div>