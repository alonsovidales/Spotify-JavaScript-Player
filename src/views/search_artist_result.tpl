{if #showHeader#}
<h1>
	Artists search result "#searchedVal#"
</h1>
Total artists found #numResults#
{/if #showHeader#}
<ul>
	{for artist in #artists#}
	<li>
		Artist: <a href="#artist.href#" type="artist" class="info_link">#artist.name#</a>
	</li>
	{/for #artists#}
</ul>

{if #showMore#}
<a href="#searchedVal#" nextpage="#nextPage#" type="searchResult_artist" class="show_more">Show More</a>
{/if #showMore#}
