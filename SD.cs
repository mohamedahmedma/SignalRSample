namespace SignalRSample
{
	public static class SD
	{
		static SD()
		{
			DealthyHallowRace = new Dictionary<string, int>();
			DealthyHallowRace.Add(Cloak, 0);
			DealthyHallowRace.Add(Stone, 0);
			DealthyHallowRace.Add(Wand, 0);
		}
		public static string Wand = "wand";
		public static string Stone = "stone";
		public static string Cloak = "cloak";

		public static Dictionary<string, int> DealthyHallowRace;
	}
}
