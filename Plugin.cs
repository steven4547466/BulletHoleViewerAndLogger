using Exiled.API.Features;
using Exiled.Events.EventArgs;
using HarmonyLib;
using MEC;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Utf8Json;

namespace BulletHoleLogger
{
    public class Plugin : Plugin<Config>
    {
		public static Plugin Instance;

		public static Harmony Harmony;

		public override string Author => "Steven4547466";

		public static long CurRoundStartedAt;

		public static List<BulletHoleData> QueuedBulletHoles = new List<BulletHoleData>();

		public static CoroutineHandle Coroutine;

		public override void OnEnabled()
		{
			Instance = this;
			Harmony = new Harmony("bullet-hole-logger-" + DateTime.Now.Ticks);
			Harmony.PatchAll();
			Exiled.Events.Handlers.Server.RoundStarted += OnRoundStarted;
			Exiled.Events.Handlers.Server.RoundEnded += OnRoundEnded;
			base.OnEnabled();
		}

		public override void OnDisabled()
		{
			Harmony.UnpatchAll();
			Exiled.Events.Handlers.Server.RoundStarted -= OnRoundStarted;
			Exiled.Events.Handlers.Server.RoundEnded -= OnRoundEnded;
			base.OnDisabled();
		}

		public void OnRoundStarted()
		{
			CurRoundStartedAt = CurrentMillis.Millis;
			Coroutine = Timing.RunCoroutine(PostQueuePeriodically());
		}

		public void OnRoundEnded(RoundEndedEventArgs ev)
		{
			PostQueue();
			Timing.KillCoroutines(Coroutine);
		}

		public IEnumerator<float> PostQueuePeriodically()
		{
			while (true)
			{
				PostQueue();
				yield return Timing.WaitForSeconds(Instance.Config.UpdateInterval);
			}
		}

		public void PostQueue()
		{
			try
			{
				if (QueuedBulletHoles.Count <= 0) return;
				var httpWebRequest = (HttpWebRequest)WebRequest.Create(Plugin.Instance.Config.PostLocation);
				httpWebRequest.ContentType = "application/json";
				httpWebRequest.Method = "POST";
				if (!string.IsNullOrEmpty(Instance.Config.Authentication))
				{
					httpWebRequest.Headers.Add("Authorization", Plugin.Instance.Config.Authentication);
				}

				using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
				{
					streamWriter.Write(JsonSerializer.ToJsonString(QueuedBulletHoles));
				}
				QueuedBulletHoles.Clear();
				WebResponse response = httpWebRequest.GetResponse();
				Log.Debug(((HttpWebResponse)response).StatusCode, Instance.Config.IsDebugEnabled);
				response.Close();
			}
			catch(Exception e)
			{
				Log.Error(e);
			}
		}
	}

	static class CurrentMillis
	{
		private static readonly DateTime Jan1St1970 = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
		public static long Millis { get { return (long)((DateTime.UtcNow - Jan1St1970).TotalMilliseconds); } }
	}
}
