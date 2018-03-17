using System;
using System.ComponentModel.DataAnnotations;
namespace adg.Models
{
    public class Report
    {
        public int ReportId { get; set; }

        public char Type { get; set; }

        public int AutoFaucets { get; set; }
        public int AutoHandDryers { get; set; }
        public int AutoPaperTowells { get; set; }
        public int AutoSoap { get; set; }
        public int AutoFlush { get; set; }

        public int SeatCovers { get; set; }
        public int GoodQualityTP { get; set; }

        public int StockedPaperTowells { get; set; }
        public int StockedSeatCovers { get; set; }
        public int StockedToiletPaper { get; set; }

        public string Comment { get; set; }

        public int UserProfileId { get; set; }
        public UserProfile UserProfile { get; set; }

        public int PlaceId { get; set; }
        public Place Place { get; set; }
    }
}