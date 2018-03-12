using System;
using System.ComponentModel.DataAnnotations;
namespace adg.Models
{
    public class Report
    {
        public int ReportId { get; set; }
        public bool Private { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Color { get; set; }
        public string Texture { get; set; }
        public string Smell { get; set; }

        public int UserProfileId { get; set; }
        public UserProfile UserProfile { get; set; }
    }
}