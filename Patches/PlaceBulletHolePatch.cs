using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Exiled.API.Features;
using Exiled.API.Features.Items;
using HarmonyLib;
using InventorySystem.Items.Firearms.Modules;
using UnityEngine;

namespace BulletHoleLogger.Patches
{
	[HarmonyPatch(typeof(StandardHitregBase), nameof(StandardHitregBase.PlaceBullethole))]
	public class PlaceBulletHolePatch
	{
		public static void Postfix(StandardHitregBase __instance, Ray ray, RaycastHit hit)
		{
			Player player = Player.Get(__instance.Hub);
			if (player != null)
			{
				Vector3 pos = hit.point;

				BulletHoleData data = new BulletHoleData()
				{
					userId = player.UserId,
					userName = player.Nickname,
					server = Plugin.Instance.Config.ServerNum,
					roundStartedAt = Plugin.CurRoundStartedAt,
					position = pos
				};
				Plugin.QueuedBulletHoles.Add(data);
			}
		}
	}
}
