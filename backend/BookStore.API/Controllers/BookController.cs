using BookStore.API.Data;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BookController : Controller
{
    private BookDbContext _bookContext;

    public BookController(BookDbContext temp)
    {
        _bookContext = temp;
    }
    
    [HttpGet("AllBooks")]
    public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, [FromQuery] List<string>? category = null)
    {
        var query = _bookContext.Books.AsQueryable();

        // 🔍 Filter by selected categories
        if (category != null && category.Any())
        {
            query = query.Where(b => category.Contains(b.Category));
        }

        var totalNumBooks = query.Count();

        var booksPage = query
            .OrderBy(b => b.Title)
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var response = new
        {
            Books = booksPage,
            TotalNumBooks = totalNumBooks
        };

        return Ok(response);
    }

    
    [HttpGet("GetCategories")]
    public IActionResult GetCategories()
    {
        var categories = _bookContext.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToList();

        return Ok(categories);
    }
    
}