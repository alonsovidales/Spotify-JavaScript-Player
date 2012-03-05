<ul>
	{for playList in #playLists#}
	<li class="play_list_li" id="#playList.id#_playlist_container_li">
		<a href="#playList.id#" type="playlist" class="info_link playlist_link">#playList.name# (<span id="playlist_total_tracks_#playList.id#_span">#playList.totalTracks#</span>)</a>
	</li>
	{/for #playLists#}
</ul>
