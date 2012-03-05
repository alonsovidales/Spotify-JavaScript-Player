{if #showHeader#}
<h1>
	Tracks search result "#searchedVal#"
</h1>
Total tracks found #numResults#
{/if #showHeader#}
<ul>
	{for track in #tracks#}
	<li>
		<ul>
			<li>
				Track: <a href="#track.href#" type="track" class="info_link track_link">#track.name#</a>
			</li>
			<li>
				Duration: #track.minSec#
			</li>
			<li>
				Popularity: <div class="popularity score_#track.popularityUpToFive#"></div>
			</li>
			<li>
				Album: <a href="#track.albumHref#" type="track" class="info_link track_link">#track.albumName# (#track.albumReleased#)</a>
			</li>
			<li>
				<ul>
					{for artist in #track.artists#}
					<li>
						Artist: <a href="#track.artist.href#" type="artist" class="info_link">#track.artist.name#</a>
					</li>
					{/for #track.artists#}
				</ul>
			</li>
		</ul>
	</li>
	{/for #tracks#}
</ul>

{if #showMore#}
<a href="#searchedVal#" nextpage="#nextPage#" type="searchResult_track" class="show_more">Show More</a>
{/if #showMore#}
