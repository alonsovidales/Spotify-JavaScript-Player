<div id="album_main_div">
	<ul>
		<li>
			<a href="#href#" type="track" aviable="{if #available}aviable{/if}">#name#</a> {if #available}(drag this link to an album to add it){/if}
		</li>
		<li>
			Popularity: <div class="popularity score_#popularityUpToFive#">#popularityUpToFive#</div>
		</li>
		<li>
			Duration (mm:ss): #minSec#
		</li>
		<li>
			Album: <a href="#albumHref#" type="album" class="info_link">#albumName# (#albumReleased#)</a>
		</li>
	</ul>

	<div id="artists_list">
		<ul>
			{for artist in artists}
			<li>
				Artist: <a href="#artist.href#" type="artist" class="info_link">#artist.name#</a>
			</li>
			{/for}
		</ul>
	</div>
</div>
