<ul>
	{for playList in #playLists#}
	<li class="play_list_li" id="#playList.id#_playlist_container_li">
		<img src="/img/speaker.png" class="hd" id="#playList.id#_play_list_speaker_icon" />
		<a href="#playList.id#" id="#playList.id#_play_list_play_icon" class="direct_play_list_button"><img src="/img/play.gif" /></a>
		<a href="#playList.id#" class="edit_playlist_link"><img src="/img/edit.png" /></a>
		<a href="#playList.id#" type="playlist" class="info_link playlist_link">
			<span id="#playList.id#_play_list_name_span">#playList.name#</span> (<span id="playlist_total_tracks_#playList.id#_span">#playList.totalTracks#</span>)
		</a>
	</li>
	{/for #playLists#}
</ul>
