namespace GiochiPreferiti.Models
{
    public class Gioco
    {

        public int Id { get; set; }
        public string? Nome { get; set; }
        public DateTime DataPubblicazione { get; set; }
        public string? UrlImmagine { get; set; }
        public string? Trama { get; set; }
        public string? Genere { get; set; }
        public string? Piattaforma { get; set; }
        public bool Completato { get; set; }
        public decimal VotoPersonale { get; set; }
    }

}