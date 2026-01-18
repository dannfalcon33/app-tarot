import os
from PIL import Image
import glob

def optimize_images(directory):
    # Extensions to look for
    extensions = ['*.png', '*.jpg', '*.jpeg']
    files = []
    # Recursively find all files
    for ext in extensions:
        files.extend(glob.glob(os.path.join(directory, '**', ext), recursive=True))
    
    print(f"Found {len(files)} images to process in {directory}")

    for file_path in files:
        try:
            filename = os.path.basename(file_path)
            name, ext = os.path.splitext(filename)
            new_filename = name + ".webp"
            # file_path is absolute or relative from glob, os.path.dirname gets the folder
            new_file_path = os.path.join(os.path.dirname(file_path), new_filename)

            # Check if webp already exists (optional, but good for idempotency if we don't want to re-process)
            # But here we want to ensure we have optimized versions, so let's process.

            with Image.open(file_path) as img:
                # Resize if width > 1920
                if img.width > 1920:
                    ratio = 1920 / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((1920, new_height), Image.Resampling.LANCZOS)
                    print(f"Resized {filename} to 1920px width.")

                # Save as WebP
                img.save(new_file_path, 'WEBP', quality=80)
                
                original_size = os.path.getsize(file_path)
                new_size = os.path.getsize(new_file_path)
                savings = (1 - new_size / original_size) * 100
                
                print(f"Optimized {filename}: {original_size/1024:.2f}KB -> {new_size/1024:.2f}KB ({savings:.2f}% saved)")
            
            # Remove original file
            os.remove(file_path)
            print(f"Deleted original: {filename}")

        except Exception as e:
            print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    # Use current directory + public as default, or allow argument
    target_dir = os.path.join(os.getcwd(), "public")
    optimize_images(target_dir)
