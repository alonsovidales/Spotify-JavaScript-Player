<div id="album_main_div">
	<h1>
		Album: "#name#"
	</h1>
	<ul>
		<li>
			Artist:
			<a href="#href#" type="artist" class="info_link">#artistName#</a>
		</li>
		<li>
			Released:
			#released#
		</li>
	</ul>

	<div id="album_tracks_list">
		<ul>
			{for track in tracks}
			<li class="{if #track.available#}aviable{/if}">
				<a href="#track.href#" type="track" class="info_link">#track.name#</a>
				<div class="artists">
					<ul>
						{for artist in track.artists}
						<li>
							Artist <a href="#track.artist.href#" type="artist" class="info_link">#track.artist.name#</a>
						</li>
						{/for}
					</ul>
				</div>
			</li>
			{/for}
		</ul>
	</div>
</div>
