<h1>
	Album: <a href="#href#" type="album" class="info_link">#name#</a>
</h1>
<ul>
	<li>
		Artist: <a href="#artistHref#" type="artist" class="info_link">#artistName#</a>
	</li>
	<li>
		Released: #released#
	</li>
</ul>

<div id="album_tracks_list">
	Tracks
	<ul>
		{for track in #tracks#}
		<li class="{if #track.available#}aviable{/if #track.available#}">
			{if #track.available#}<a href="#track.href#" type="track" class="info_link track_link">{/if #track.available#}#track.name#{if #track.available#}</a>{/if #track.available#}
			<div class="artists">
				<ul>
					{for artist in #track.artists#}
					<li>
						Artist: <a href="#track.artist.href#" type="artist" class="info_link">#track.artist.name#</a>
					</li>
					{/for #track.artists#}
				</ul>
			</div>
		</li>
		{/for #tracks#}
	</ul>
</div>
