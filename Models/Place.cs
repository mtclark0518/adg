using System;
using System.Collections.Generic;
namespace adg.Models
{
    public class Place
    {
        public int PlaceId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public List<Report> Reports { get; set; }
    }
}
