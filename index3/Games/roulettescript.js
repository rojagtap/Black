function fireit()
{
	var theone=Math.floor(Math.random()*6)

	if (theone<=document.fire.bullets.value-1)
		alert("Bang. You\'re dead! " +theone)
	else
	{
		document.fire.message.value="Whew. Got lucky!"
		setTimeout("document.fire.message.value='Play Roulette'",500)
	}
}
