using Exiled.API.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BulletHoleLogger
{
	public sealed class Config : IConfig
	{
		public bool IsEnabled { get; set; } = true;

		public bool IsDebugEnabled { get; set; } = false;

		public string PostLocation { get; set; } = "http://localhost:4950/bullets";

		public string Authentication { get; set; } = string.Empty;

		public int ServerNum { get; set; } = 1;

		public float UpdateInterval { get; set; } = 5;
	}
}
