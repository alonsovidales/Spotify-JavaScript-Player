{if #showHeader#}
<h1>
	Albums search result "#searchedVal#"
</h1>
Total albums found #numResults#
{/if #showHeader#}

<ul>
	{for album in #albums#}
	<li>
		<ul>
			<li>
				Album: <a href="#album.href#" type="album" class="info_link">#album.name#</a>
			</li>
			<li>
				<ul>
					{for artist in #album.artists#}
					<li>
						Artist: <a href="#album.artist.href#" type="artist" class="info_link">#album.artist.name#</a>
					</li>
					{/for #album.artists#}
				</ul>
			</li>
		</ul>
	</li>
	{/for #albums#}
</ul>

{if #showMore#}
<a href="#searchedVal#" nextpage="#nextPage#" type="searchResult_album" class="show_more">Show More</a>
{/if #showMore#}
