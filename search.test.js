/**
 * @jest-environment jsdom
 */


//Mock fetch for the search function
const mockFetchData = [
  { 
    formattedUrl: 'url', 
    htmlTitle: 'title', 
    htmlSnippet: 'snippet' 
  },
  { 
    formattedUrl: 'ur2l', 
    htmlTitle: 'title2', 
    htmlSnippet: 'ipsolurm' 
  }
];
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ items: mockFetchData }),
    })
);

// Mock Blob and URL.createObjectURL for the test environment
global.URL = {
    createObjectURL: jest.fn(() => 'blob:mockurl')
};

//Mock the index.html structure
document.body.innerHTML = `
  <a id="downloadBtn"></a>
  <input id="searchInput" />
  <div class="search-result"></div>
`;

const { setUpDownloadElement, search, loadSearchResults} = require('./search.js');

describe('search', () => {
  it('should fetch and return data', async () => {
    const data = await search('test');
    expect(data.items).toBe(mockFetchData);
    expect(fetch).toHaveBeenCalled();
  });
});

describe('setUpDownloadElement', () => {
  it('should set href and download attributes when data is present', () => {
        const downloadBtn = document.getElementById('downloadBtn');
        const data = [{ foo: 'bar' }];
        setUpDownloadElement(data, 'test.json', downloadBtn);
        expect(downloadBtn.href).toBe('blob:mockurl');
        expect(downloadBtn.download).toBe('test.json');
        expect(downloadBtn.classList.contains('disabled')).toBe(false);
    });

    it('should disable the element when data is empty', () => {
        const downloadBtn = document.getElementById('downloadBtn');
        setUpDownloadElement([], 'test.json', downloadBtn);
        expect(downloadBtn.hasAttribute('href')).toBe(false);
        expect(downloadBtn.hasAttribute('download')).toBe(false);
        expect(downloadBtn.classList.contains('disabled')).toBe(true);
    });
});

describe('loadSearchResults', () => {
  it('should render results', () => {
    const element = document.querySelector('.search-result');
    loadSearchResults(mockFetchData, element);

    const resultDivs = element.querySelectorAll('.search-result-item');
    expect(resultDivs.length).toBe(mockFetchData.length);

    resultDivs.forEach((resultDiv, i) => {
      const result = mockFetchData[i];

      const anchor = resultDiv.querySelector('a');
      expect(anchor).not.toBeNull();
      expect(anchor.href).toContain(result.formattedUrl);
      expect(anchor.target).toBe('_blank');

      const h3 = resultDiv.querySelector('h3');
      expect(h3).not.toBeNull();
      expect(h3.textContent).toBe(result.htmlTitle);

      const p = resultDiv.querySelector('p');
      expect(p).not.toBeNull();
      expect(p.textContent).toBe(result.htmlSnippet);
    });
  });

  it('should show "No results found."', () => {
    const element = document.querySelector('.search-result');
    loadSearchResults([], element);
    expect(element.textContent).toBe('No results found.');
  });
});