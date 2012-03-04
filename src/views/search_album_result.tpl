{if #showHeader#}
<h1>
	Albums search result "#searchedVal#"
</h1>
Total albums found #numResults#
{/if #showHeader#}
<ul>
	{for album in #albums#}
	<li>
		Album: <a href="#album.href#" type="album" class="info_link">#album.name#</a>
	</li>
	{/for #albums#}
</ul>

{if #showMore#}
<a href="#searchedVal#" nextpage="#nextPage#" type="searchResult_album" class="show_more">Show More</a>
{/if #showMore#}
