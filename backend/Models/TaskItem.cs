using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        // Low, Medium, High
        public string Priority { get; set; } = "Low";

        public DateTime? DueDate { get; set; }

        // Todo, Done
        public string Status { get; set; } = "Todo";
    }
}