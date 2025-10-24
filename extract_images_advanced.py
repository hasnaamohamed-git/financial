#!/usr/bin/env python3
import fitz  # PyMuPDF
import os
from PIL import Image
import io

def extract_images_from_pdf_advanced(pdf_path):
    """Extract images from PDF using PyMuPDF"""
    images = []
    
    try:
        # Open the PDF
        pdf_document = fitz.open(pdf_path)
        
        for page_num in range(len(pdf_document)):
            page = pdf_document[page_num]
            
            # Get list of images on the page
            image_list = page.get_images()
            
            for img_index, img in enumerate(image_list):
                # Get image data
                xref = img[0]
                pix = fitz.Pixmap(pdf_document, xref)
                
                if pix.n - pix.alpha < 4:  # GRAY or RGB
                    img_name = f"page_{page_num + 1}_img_{img_index + 1}.png"
                    img_path = f"/workspace/{img_name}"
                    
                    if pix.alpha:
                        pix = fitz.Pixmap(fitz.csRGB, pix)
                    
                    pix.save(img_path)
                    
                    images.append({
                        'page': page_num + 1,
                        'name': img_name,
                        'path': img_path,
                        'size': (pix.width, pix.height)
                    })
                    
                    print(f"Extracted: {img_name} from page {page_num + 1} ({pix.width}x{pix.height})")
                    
                pix = None  # Free memory
        
        pdf_document.close()
        
    except Exception as e:
        print(f"Error extracting images: {e}")
    
    return images

def extract_text_with_images(pdf_path):
    """Extract text and identify image locations"""
    content = []
    
    try:
        pdf_document = fitz.open(pdf_path)
        
        for page_num in range(len(pdf_document)):
            page = pdf_document[page_num]
            
            # Extract text
            text = page.get_text()
            
            # Get image information
            images = page.get_images()
            
            page_content = {
                'page': page_num + 1,
                'text': text,
                'image_count': len(images),
                'images': []
            }
            
            for img_index, img in enumerate(images):
                # Get image rectangle
                img_rect = page.get_image_rects(img[0])
                if img_rect:
                    page_content['images'].append({
                        'index': img_index,
                        'rect': img_rect[0] if img_rect else None
                    })
            
            content.append(page_content)
        
        pdf_document.close()
        
    except Exception as e:
        print(f"Error extracting content: {e}")
    
    return content

if __name__ == "__main__":
    pdf_path = "/workspace/imp.pdf"
    
    print("Extracting images using PyMuPDF...")
    images = extract_images_from_pdf_advanced(pdf_path)
    
    print(f"\nExtracted {len(images)} images:")
    for img in images:
        print(f"  - {img['name']} ({img['size'][0]}x{img['size'][1]})")
    
    print("\nExtracting content with image locations...")
    content = extract_text_with_images(pdf_path)
    
    # Save results
    import json
    with open('/workspace/extracted_images.json', 'w') as f:
        json.dump({
            'images': images,
            'content_with_images': content
        }, f, indent=2, default=str)
    
    print(f"\nProcessed {len(content)} pages")
    for page in content:
        if page['image_count'] > 0:
            print(f"Page {page['page']}: {page['image_count']} images found")