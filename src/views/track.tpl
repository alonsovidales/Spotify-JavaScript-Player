<h1>
	<a href="#href#" type="track" aviable="{if #available#}aviable{/if #available#}">#name#</a> {if #available}
</h1>
<ul>
	<li>
		Popularity: <div class="popularity score_#popularityUpToFive#"></div>
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
		{for artist in #artists#}
		<li>
			Artist: <a href="#artist.href#" type="artist" class="info_link">#artist.name#</a>
		</li>
		{/for #artists#}
	</ul>
</div>
