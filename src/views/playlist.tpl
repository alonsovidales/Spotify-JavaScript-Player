<h1>
	Play List "#name#"
</h1>
Tracks
<ul>
	{for track in #tracks#}
		<li>
			<img src="img/speaker.png" class="hd" />
			<a href="#track.href#" type="play_track"><img src="img/play.gif" /></a>
			<a href="#track.href#" type="track" playlist="#playlistId#" trackid="#track.id#" class="info_link track_link">(#track.minSec#) #track.name#</a>
		</li>
	{/for #tracks#}
</ul>
