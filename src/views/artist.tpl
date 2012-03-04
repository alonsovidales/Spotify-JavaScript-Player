<h1>
	Artist: "#name#"
</h1>

<div id="albums_list">
	<ul>
		{for album in #albums#}
		<li>
			<ul>
				<li>
					Album: <a href="#album.href#" type="album" class="info_link">#album.name#</a>
				</li>
				<li>
				Artist: <a href="#album.artistHref#" type="artist" class="info_link">#album.artist#</a>
				</li>
			</ul>
		</li>
		{/for #albums#}
	</ul>
</div>
