{if #showHeader#}
<h1>
	Albums search result "#searchedVal#"
</h1>
Total albums found #numResults#
{/if}
{for album in albums}
<ul>
	<li>
		Album: <a href="#album.href#" type="album" class="info_link">#album.name#</a>
	</li>
</ul>
{/for}

{if #showMore#}
<a href="#searchedVal#" nextpage="#nextPage#" type="searchResult_album" class="show_more">Show More</a>
{/if}
