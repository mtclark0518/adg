using System;
using System.Collections.Generic;

namespace adg.Models
{
    public class ReportQuery
    {
        public int requester { get; set; }

        public bool nearby { get; set; }

        public bool filtered { get; set; }
        public bool byColor { get; set; }
        public bool bySmell { get; set; }
        public bool byTexture { get; set; }

        public List<string> ColorFilter { get; set; }
        public List<string> SmellFilter { get; set; }
        public List<string> TextureFilter { get; set; }
    }
}
