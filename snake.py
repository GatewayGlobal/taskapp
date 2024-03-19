import pygame
import time
import random

# Initialize Pygame
pygame.init()

# Set up the screen
screen = pygame.display.set_mode((600, 600))
pygame.display.set_caption("Snake Game")
clock = pygame.time.Clock()

# Colors
black = (0, 0, 0)
white = (255, 255, 255)
red = (255, 0, 0)

# Snake
snake = [(300, 300)]
snake_speed = (0, 0)
snake_block = 20

# Food
food = (random.randint(0, 29) * 20, random.randint(0, 29) * 20)

# Score
score = 0

# Game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                snake_speed = (0, -snake_block)
            if event.key == pygame.K_DOWN:
                snake_speed = (0, snake_block)
            if event.key == pygame.K_LEFT:
                snake_speed = (-snake_block, 0)
            if event.key == pygame.K_RIGHT:
                snake_speed = (snake_block, 0)

    # Update snake position
    new_head = (snake[0][0] + snake_speed[0], snake[0][1] + snake_speed[1])
    snake.insert(0, new_head)

    # Check if the snake eats the food
    if new_head == food:
        food = (random.randint(0, 29) * 20, random.randint(0, 29) * 20)
        score += 1
    else:
        snake.pop()

    # Check if the snake goes out of the screen
    if new_head[0] < 0 or new_head[0] >= 600 or new_head[1] < 0 or new_head[1] >= 600:
        font = pygame.font.SysFont(None, 50)
        text = font.render("Game Over! Score: " + str(score) + " Press any key to start again", True, white)
        text_rect = text.get_rect(center=(300, 300))
        screen.blit(text, text_rect)
        pygame.display.flip()

        # Wait for user input to start again
        waiting = True
        while waiting:
            for event in pygame.event.get():
                if event.type == pygame.KEYDOWN:
                    snake = [(300, 300)]
                    snake_speed = (0, 0)
                    food = (random.randint(0, 29) * 20, random.randint(0, 29) * 20)
                    score = 0
                    waiting = False
                    break

    # Draw everything
    screen.fill(black)
    for segment in snake:
        pygame.draw.rect(screen, white, (*segment, snake_block, snake_block))
    pygame.draw.rect(screen, red, (*food, snake_block, snake_block))

    # Display score
    font = pygame.font.SysFont(None, 30)
    text = font.render("Score: " + str(score), True, white)
    screen.blit(text, (10, 10))

    pygame.display.flip()
    clock.tick(10)

pygame.quit()
